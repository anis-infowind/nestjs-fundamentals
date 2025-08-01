import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostModel } from 'generated/prisma';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
  ) {}

  @Get('post/:id')
  async getPostById(@Param('id', new ParseObjectIdPipe()) id: string): Promise<PostModel | null> {
    return this.postService.post({ id: String(id) });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('create')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
      },
    },
  })
  async createDraft(
    @Body() postData: { title: string; content?: string; },
  ): Promise<PostModel> {
    const { title, content } = postData;
    const now = new Date();
    return this.postService.createPost({
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });
  }

  @Put('publish/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
      },
    },
    required: false,
  })
  async publishPost(
    @Param('id') id: string,
    @Body() postData: { content?: string; },
  ): Promise<PostModel> {
    const { content } = postData;
    const now = new Date();
    return this.postService.updatePost({
      where: { id: String(id) },
      data: { content, published: true, updatedAt: now },
    });
  }

  @Delete('delete/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: String(id) });
  }
}
