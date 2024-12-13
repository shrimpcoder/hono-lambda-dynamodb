import { DynamoDBMiddleware } from "./middleware/dynamodb";

export interface Env {
  Variables: {
    dynamodb: DynamoDBMiddleware;
  };
}
