import { SetMetadata } from '@nestjs/common';

export const SkipJwtAuth = () => SetMetadata('isPublic', true);
