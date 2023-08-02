import { Request, Response } from 'express';
import { UserDto } from '../models/UserModel';
import axios from 'axios';
import { ITEMS_PER_PAGE, Options } from '../types';
// import { UserDefinition } from '../storage/User';

const REMOTE_USER_API_URL = 'https://jsonplaceholder.typicode.com/users';

class UserController {
  public async getRemoteUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const offset = (page - 1) * ITEMS_PER_PAGE;

      const data: UserDto[] = await this.fetchRemoteData({
        offset,
        limit: ITEMS_PER_PAGE
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch remote data' });
    }
  }

  private async fetchRemoteData(options: Options): Promise<UserDto[]> {
    try {
      const response = await axios.get<UserDto[]>(
        REMOTE_USER_API_URL,
        { params: { _start: options.offset, _limit: options.limit } }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch remote data');
    }
  }
}

// TODO: seems this logic is redundant, due to no the task definition
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
