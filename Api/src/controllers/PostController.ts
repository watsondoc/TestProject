import { Request, Response } from 'express';
import { PostDto } from '../models/PostModel';
import { PostDefinition } from '../storage/Post';
import axios from 'axios';
import { ITEMS_PER_PAGE, Options } from '../types';
const { Op } = require("sequelize");

const REMOTE_API_URL = 'https://jsonplaceholder.typicode.com/posts';

class PostController {
  async getPostsByUserId(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid userId' });
    }

    const page = parseInt(req.query.page as string, 10) || 0;
    const perPage = parseInt(req.query.perPage as string, 10) || ITEMS_PER_PAGE;
    const searchText =  req.query.searchText as string;
    const offset = page * perPage;

    try {
      const postsCount = await this.getPostsCountByUserId(userId, searchText);
      if (postsCount > 0) {
        const postsInstances = await this.getPostFromDb(
          userId,
          { limit: perPage, offset: offset, query: searchText }
        );
        res.json({
          posts: postsInstances,
          totalPosts: postsCount,
        });
      } else {
        const posts: PostDto[] = await this.fetchPostsByUserId(userId);
        await this.populatePosts(posts);
        return this.getPostsByUserId(req, res);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts by UserId' });
    }
  }

  public async removePost(req: Request, res: Response) {
    const userId = parseInt(req.params.userId, 10);
    const postId = parseInt(req.params.postId, 10);

    if (isNaN(userId) || isNaN(postId)) {
      res.status(400).json({ error: 'Invalid userId' });
    }

    await this.removePostFromDb(userId, postId);
    res.status(204).json({ message: 'success delete' });
  }

  private async removePostFromDb(userId: number, postId: number) {
    const existingPost = await PostDefinition.findOne({
      where: { userId, id: postId },
    });

    if (existingPost) {
      return existingPost.destroy();
    }
  }

  private async getPostsCountByUserId(userId: number, query?: string): Promise<number> {
    const where = this.buildWhereOption(userId, query);
    const count = await PostDefinition.count({ where });

    return count;
  }

  private async fetchPostsByUserId(userId: number): Promise<PostDto[]> {
    try {
      const response = await axios.get<PostDto[]>(REMOTE_API_URL,
        {
          params: {
            userId: userId,
          }
        });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch posts by UserId');
    }
  }

  private async getPostFromDb(userId: number, options: Options): Promise<PostDto[]> {
    try {
      const where = this.buildWhereOption(userId, options.query);

      const posts = await PostDefinition.findAll({
        where,
        limit: options.limit,
        offset: options.offset,
      });

      return posts.map((post) => {
        return {
          id: post.id,
          userId: post.userId,
          title: post.title,
          body: post.body,
        }
      });
    } catch (error) {
      throw new Error('Failed to fetch remote data from db');
    }
  }

  private buildWhereOption(userId: number, query?: string) {
    const where: any = {
      [Op.and]: [
        { userId },
      ]
    };

    if (query) {
      const likeSearch = { [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { body: { [Op.like]: `%${query}%` } }
        ]}
      where[Op.and].push(likeSearch);
    }

    return where;
  }

  private async populatePosts(posts: PostDto[]) {
    try {
      await PostDefinition.bulkCreate(posts as any);
    } catch(error: any) {
      throw new Error(error.message);
    }
  }
}

export = new PostController();
