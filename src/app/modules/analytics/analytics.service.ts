import { prisma } from "../../shared/prisma";

const getAnalytics = async () => {
  const [
    totalServices,
    totalBlogs,
    totalFAQs,
    totalLinks,
    totalNotices,
    totalHeroImages,
    recentServices,
    recentBlogs,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.blog.count(),
    prisma.faq.count(),
    prisma.link.count(),
    prisma.notice.count(),
    prisma.heroImage.count(),
    prisma.service.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Aggregate growth data for the last 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      month: date.toLocaleString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
    });
  }

  // Get creation dates for services and blogs to calculate monthly growth
  // (Simplified: we count how many items exist currently created in those months)
  const growth = await Promise.all(months.map(async (m) => {
    const startDate = new Date(m.year, m.monthIndex, 1);
    const endDate = new Date(m.year, m.monthIndex + 1, 0);

    const serviceCount = await prisma.service.count({
      where: { createdAt: { gte: startDate, lte: endDate } }
    });
    const blogCount = await prisma.blog.count({
      where: { createdAt: { gte: startDate, lte: endDate } }
    });

    return {
      date: `${m.year}-${String(m.monthIndex + 1).padStart(2, '0')}-01`,
      services: serviceCount,
      blogs: blogCount,
    };
  }));

  return {
    totalServices,
    totalBlogs,
    totalFAQs,
    totalLinks,
    totalNotices,
    totalHeroImages,
    recentServices,
    recentBlogs,
    growth,
  };
};

export const AnalyticsService = {
  getAnalytics,
};
