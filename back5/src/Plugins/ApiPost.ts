import {applyDecorators, Post} from '@nestjs/common';
import {ApiOperation} from '@nestjs/swagger';

export function ApiPost(path?: string, summary?: string, description?: string) {
    return applyDecorators(
        Post(path),
        ApiOperation({summary, description}),
    );
}
