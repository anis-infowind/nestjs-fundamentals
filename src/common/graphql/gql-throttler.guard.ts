import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip throttling for GraphQL requests entirely
    if (context.getType() as string === 'graphql') {
      return true;
    }
    
    return super.canActivate(context);
  }
}