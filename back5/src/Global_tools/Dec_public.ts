import {SetMetadata} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export  const Dec_public = () => SetMetadata(IS_PUBLIC_KEY, true);

 
