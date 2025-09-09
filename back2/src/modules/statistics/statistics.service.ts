import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async get_system_statistics() {
    const [total_users, total_articles, published_articles, total_categories, total_tags, total_comments, total_views, total_likes] = await Promise.all([
      this.prisma.user.count({
        where: { is_active: true },
      }),
      this.prisma.article.count({
        where: { is_active: true },
      }),
      this.prisma.article.count({
        where: { is_published: true, is_active: true },
      }),
      this.prisma.category.count({
        where: { is_active: true },
      }),
      this.prisma.tag.count({
        where: { is_active: true },
      }),
      this.prisma.comment.count({
        where: { is_active: true },
      }),
      this.prisma.article.aggregate({
        where: { is_active: true },
        _sum: { view_count: true },
      }),
      this.prisma.article.aggregate({
        where: { is_active: true },
        _sum: { like_count: true },
      }),
    ])

    return {
      users: {
        total: total_users,
      },
      articles: {
        total: total_articles,
        published: published_articles,
        draft: total_articles - published_articles,
        total_views: total_views._sum.view_count || 0,
        total_likes: total_likes._sum.like_count || 0,
      },
      categories: {
        total: total_categories,
      },
      tags: {
        total: total_tags,
      },
      comments: {
        total: total_comments,
      },
    }
  }

  async get_recent_activity(limit: number = 10) {
    const [recent_articles, recent_comments, recent_users] = await Promise.all([
      this.prisma.article.findMany({
        where: { is_published: true, is_active: true },
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          created_at: true,
          author: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
        },
      }),
      this.prisma.comment.findMany({
        where: { is_active: true },
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          content: true,
          created_at: true,
          author: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.user.findMany({
        where: { is_active: true },
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true,
          created_at: true,
        },
      }),
    ])

    return {
      recent_articles,
      recent_comments,
      recent_users,
    }
  }

  async get_popular_content(limit: number = 10) {
    const [popular_articles, popular_categories, popular_tags] = await Promise.all([
      this.prisma.article.findMany({
        where: { is_published: true, is_active: true },
        take: limit,
        orderBy: [{ view_count: 'desc' }, { like_count: 'desc' }],
        select: {
          id: true,
          title: true,
          slug: true,
          view_count: true,
          like_count: true,
          created_at: true,
          author: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
        },
      }),
      this.prisma.category.findMany({
        where: { is_active: true },
        take: limit,
        orderBy: { article_count: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          article_count: true,
          created_at: true,
        },
      }),
      this.prisma.tag.findMany({
        where: { is_active: true },
        take: limit,
        orderBy: { article_count: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          article_count: true,
          created_at: true,
        },
      }),
    ])

    return {
      popular_articles,
      popular_categories,
      popular_tags,
    }
  }
}
