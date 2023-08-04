import { Request, Response } from 'express';
import { UserDto } from '../models/UserModel';
import axios from 'axios';
import { ITEMS_PER_PAGE, Options, SortDirection } from '../types';

const REMOTE_USER_API_URL = 'https://jsonplaceholder.typicode.com/users';

class UserController {
  public async getRemoteUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 0;
      const perPage = parseInt(req.query.perPage as string, 10) || ITEMS_PER_PAGE;
      const sortBy = req.query.sortBy as string;
      const sortDir = req.query.sortDir as SortDirection;

      const offset = page * perPage;

      const data = await this.fetchRemoteData({
        offset,
        limit: perPage,
        sortBy,
        sortDir,
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch remote data' });
    }
  }

  private async fetchRemoteData(options: Options): Promise<{ users: UserDto[], totalUsers: number}> {
    try {
      const response = await axios.get<UserDto[]>(
        REMOTE_USER_API_URL,
        { params: {
          _start: options.offset,
          _limit: options.limit,
          _sort: options.sortBy,
          _order: options.sortDir,
        } }
      );
      const totalUsers = response.headers['x-total-count'];
      return {
        users: response.data,
        totalUsers
      };
    } catch (error) {
      throw new Error('Failed to fetch remote data');
    }
  }
}

// TODO: seems this logic is redundant, due to no requirements in the task definition for storing users in DB
/*
export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const users: UserDto[] = await UserDefinition.findAll({
      attributes: ['id', 'name', 'email', 'address'],
      limit: ITEMS_PER_PAGE,
      offset,
    });

    const totalItems = await UserDefinition.count();
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    res.json({
      data: users,
      page,
      totalPages,
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
*/

export = new UserController();
