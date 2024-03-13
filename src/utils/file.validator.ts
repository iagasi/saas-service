import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || !value.mimetype) {
      throw new UnprocessableEntityException('File not provided');
    }
    console.log(value.mimetype);

    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (!allowedTypes.includes(value.mimetype)) {
      throw new UnprocessableEntityException(
        'Invalid file type. Allowed types: ' + allowedTypes.join(', '),
      );
    }
    return value;
  }
}
