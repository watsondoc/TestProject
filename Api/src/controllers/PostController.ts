import { Request, Response } from 'express';
import { PostDto } from '../models/PostModel';
import { PostDefinition } from '../storage/Post';
import axios from 'axios';
import { ITEMS_PER_PAGE, Options } from '../types';

const REMOTE_API_URL = 'https://jsonplaceholder.typicode.com/posts';

class PostController {
  async getPostsByUserId(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid userId' });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
      const isPostsExists = await this.isPostExistsByUserId(userId);
      if (isPostsExists) {
        const postsInstances = await this.getPostFromDb(
          userId,
          { limit: ITEMS_PER_PAGE, offset: offset }
        );
        res.json(postsInstances);
      } else {
        const posts: PostDto[] = await this.fetchPostsByUserId(userId, {
          offset,
          limit: ITEMS_PER_PAGE
        });
        await this.populatePosts(posts);
        return this.getPostsByUserId(req, res);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts by UserId' });
    }
  }

  private async isPostExistsByUserId(userId: number): Promise<boolean> {
    const postObject = await PostDefinition.findOne({
      where: { userId },
    });

    return postObject ? true : false;
  }

  private async fetchPostsByUserId(userId: number, options: Options): Promise<PostDto[]> {
    try {
      const response = await axios.get<PostDto[]>(REMOTE_API_URL,
        {
          params: {
            userId: userId,
            _start: options.offset,
            _limit: options.limit
          }
        });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch posts by UserId');
    }
  }

  private async getPostFromDb(userId: number, options: Options): Promise<PostDto[]> {
    try {
      const posts = await PostDefinition.findAll({
        where: {
          userId,
        },
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

  private async populatePosts(posts: PostDto[]) {
    try {
      await PostDefinition.bulkCreate(posts as any);
    } catch(error: any) {
      throw new Error(error.message);
    }
  }
}

export = new PostController();
