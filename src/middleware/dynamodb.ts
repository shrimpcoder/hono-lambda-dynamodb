import { MiddlewareHandler } from "hono";
import {
  DynamoDBClient,
  DynamoDBClientConfig,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Env } from "../env";

export interface DynamoDBItem {
  id: string;
  [key: string]: any;
}

export interface DynamoDBMiddleware {
  getItem: (id: string) => Promise<DynamoDBItem | void>;
  putItem: (item: DynamoDBItem) => Promise<void>;
  updateItem: (id: string, item: Partial<DynamoDBItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  scanItems: () => Promise<DynamoDBItem[]>;
}

export const createDynamoDBClient = (config?: DynamoDBClientConfig) => {
  const client = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
    ...config,
  });
  return DynamoDBDocumentClient.from(client);
};

export const dynamoDBMiddleware = (
  tableName: string,
  config?: DynamoDBClientConfig
): MiddlewareHandler<Env> => {
  const documentClient = createDynamoDBClient(config);

  return async (c, next) => {
    c.set("dynamodb", {
      getItem: async (id: string) => {
        try {
          const command = new GetCommand({
            TableName: tableName,
            Key: { id },
          });
          const result = await documentClient.send(command);
          return (result.Item as DynamoDBItem) ?? null;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      putItem: async (item: DynamoDBItem) => {
        try {
          const command = new PutCommand({
            TableName: tableName,
            Item: item,
          });
          await documentClient.send(command);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      updateItem: async (id: string, item: Partial<DynamoDBItem>) => {
        try {
          const updateExpression: string[] = [];
          const expressionAttributeNames: Record<string, string> = {};
          const expressionAttributeValues: Record<string, any> = {};

          Object.entries(item).forEach(([key, value]) => {
            if (key === "id") {
              updateExpression.push(`#${key} = :${key}`);
              expressionAttributeNames[`#${key}`] = key;
              expressionAttributeValues[`:${key}`] = value;
            }
          });

          const command = new UpdateCommand({
            TableName: tableName,
            Key: { id },
            UpdateExpression: updateExpression.join(", "),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
          });

          await documentClient.send(command);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      deleteItem: async (id: string) => {
        try {
          const command = new DeleteCommand({
            TableName: tableName,
            Key: { id },
          });
          await documentClient.send(command);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      scanItems: async () => {
        try {
          const command = new ScanCommand({
            TableName: tableName,
          });
          const result = await documentClient.send(command);
          return (result.Items as DynamoDBItem[]) ?? [];
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    });

    return next();
  };
};
