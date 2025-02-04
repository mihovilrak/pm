import { Request, Response } from 'express';
import { Session } from 'express-session';
import { Pool } from 'pg';
import * as activityTypeModel from '../../models/activityTypeModel';
import * as activityTypeController from '../activityTypeController';
import { CustomRequest } from '../../types/express';
import {
  ActivityType,
  ActivityTypeCreateInput,
  ActivityTypeUpdateInput,
} from '../../types/activityType';

// Mock the models
jest.mock('../../models/activityTypeModel');

describe('ActivityTypeController', () => {
  let mockReq: Partial<Request & CustomRequest>;
  let mockRes: Partial<Response>;
  let mockPool: Partial<Pool>;

  beforeEach(() => {
    // Create a partial mock Session object with required properties
    const mockSession = {
      id: 'test-session-id',
      cookie: {
        originalMaxAge: null,
        expires: undefined,
        secure: false,
        httpOnly: true,
        path: '/',
        domain: undefined,
        sameSite: 'strict'
      },
      regenerate: (callback: (err: any) => void) => callback(null),
      destroy: (callback: (err: any) => void) => callback(null),
      reload: (callback: (err: any) => void) => callback(null),
      resetMaxAge: () => {},
      touch: (callback: (err: any) => void) => callback(null),
      save: (callback: (err: any) => void) => callback(null),
      user: {
        id: '1',
        login: 'test',
        role_id: 1
      }
    } as Session & Partial<{ user: { id: string; login: string; role_id: number } }>;

    mockReq = {
      params: {},
      query: {},
      body: {},
      session: mockSession
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockPool = {};
    jest.clearAllMocks();
  });

  describe('getActivityTypes', () => {
    it('should return activity types', async () => {
        const mockActivityTypes: ActivityType[] = [
            {
                id: 1,
                name: 'Test Activity Type',
                color: '#000000',
                icon: 'test-icon',
                active: true,
                created_on: new Date(),
                updated_on: new Date()
            },
            {
                id: 2,
                name: 'Test Activity Type 2',
                color: '#000000',
                icon: 'test-icon',
                active: true,
                created_on: new Date(),
                updated_on: new Date()
            }
        ];
        (activityTypeModel.getActivityTypes as jest.Mock).mockResolvedValue(mockActivityTypes);
        
        await activityTypeController.getActivityTypes(
            mockReq as Request,
            mockRes as Response,
            mockPool as Pool
        );
      expect(activityTypeModel.getActivityTypes).toHaveBeenCalledWith(mockPool);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockActivityTypes);
    });

    it('should handle errors appropriately', async () => {
        (activityTypeModel.getActivityTypes as jest.Mock).mockRejectedValue(new Error('Database error'));
        await activityTypeController.getActivityTypes(
            mockReq as Request,
            mockRes as Response,
            mockPool as Pool
        );
      expect(activityTypeModel.getActivityTypes).toHaveBeenCalledWith(mockPool);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('createActivityType', () => {
    it('should create an activity type', async () => {
        const mockActivityTypeData: ActivityTypeCreateInput = {
            name: 'Test Activity Type',
            color: '#000000',
            icon: 'test-icon'
        };
        const createdActivityType: ActivityType = {
            id: 1,
            ...mockActivityTypeData,
            active: true,
            created_on: new Date(),
            updated_on: new Date()
        };

        (activityTypeModel.createActivityType as jest.Mock).mockResolvedValue(createdActivityType);
        
        await activityTypeController.createActivityType(
            mockReq as Request,
            mockRes as Response,
            mockPool as Pool
        );

      expect(activityTypeModel.createActivityType).toHaveBeenCalled();
      expect(activityTypeModel.createActivityType).toHaveBeenCalledWith(mockPool, mockActivityTypeData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdActivityType);
    });

    it('should return 400 if the user is not authenticated', async () => {
      const unauthorizedUser = {} as Session & Partial<{ user: { id: string; login: string; role_id: number } }>;
      mockReq.session = unauthorizedUser;
      mockReq.body = { name: 'Test Activity Type', color: '#000000', icon: 'test-icon' };

      await activityTypeController.createActivityType(
        mockReq as Request,
        mockRes as Response,
        mockPool as Pool
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'User not authenticated'
        })
      );
    });

    it('should return 400 when color is not a valid hex color', async () => {
      const mockInvalidColors = ['#0000008', 'white', 'rgb(0,0,0)'];
      
      for (const color of mockInvalidColors) {
        mockReq.body = { name: 'Test Activity Type', color, icon: 'test-icon' };
        
        await activityTypeController.createActivityType(
          mockReq as Request,
          mockRes as Response,
          mockPool as Pool
        );

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: 'Invalid color format'
          })
        );
      }
    })
  });

  describe('updateActivityType', () => {
    const mockUpdateData = {
      name: 'Updated Activity Type'
    };

    it('should update an activity type successfully', async () => {
      const activityTypeId = '1';
      mockReq.params = { id: activityTypeId };
      mockReq.body = mockUpdateData;
      const updatedActivityType = {
        id: activityTypeId,
        name: 'Updated Activity Type',
        color: '#000000',
        icon: 'test-icon',
        active: true,
        created_on: new Date(),
        updated_on: new Date()
      };
      (activityTypeModel.updateActivityType as jest.Mock).mockResolvedValue(updatedActivityType);

      await activityTypeController.updateActivityType(
        mockReq as Request,
        mockRes as Response,
        mockPool as Pool
      );

      expect(activityTypeModel.updateActivityType).toHaveBeenCalledWith(mockPool, activityTypeId, mockUpdateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedActivityType);
    });

    it('shoul return 404 when activity type is not found', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = mockUpdateData;
      (activityTypeModel.updateActivityType as jest.Mock).mockResolvedValue(null);

      await activityTypeController.updateActivityType(
        mockReq as Request,
        mockRes as Response,
        mockPool as Pool
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Activity type not found' });
    });
  });

  describe('deleteActivityType', () => {
    it('should delete an activity type successfully', async () => {
      const activityTypeId = '1';
      mockReq.params = { id:activityTypeId };
      (activityTypeModel.deleteActivityType as jest.Mock).mockResolvedValue({ success: true });

      await activityTypeController.deleteActivityType(
        mockReq as Request,
        mockRes as Response,
        mockPool as Pool
      );

      expect(activityTypeModel.deleteActivityType).toHaveBeenCalledWith(mockPool, activityTypeId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle errors appropriately', async () => {
      mockReq.params = { id: '123' };
      (activityTypeModel.deleteActivityType as jest.Mock).mockRejectedValue(new Error('Database error'));

      await activityTypeController.deleteActivityType(
        mockReq as Request,
        mockRes as Response,
        mockPool as Pool
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getAvailableIcons', () => {
    it('should return a list of available icons', async () => {
      const mockIcons = [
        'work', 'code', 'bug_report', 'build', 'meeting_room', 
        'description', 'schedule', 'search', 'analytics', 'design_services', 
        'cloud', 'support', 'more_horiz'
    ];
      (activityTypeController.getAvailableIcons as jest.Mock).mockResolvedValue(mockIcons);
      
      await activityTypeController.getAvailableIcons(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockIcons);
    });

    it('should handle errors appropriately', async () => {
      (activityTypeController.getAvailableIcons as jest.Mock).mockRejectedValue(new Error('Failed to fetch icons error'));

      await activityTypeController.getAvailableIcons(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch icons' });
    })
  });
});
