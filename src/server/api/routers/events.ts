import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findMany();
  }),
  getUserEvents:  privateProcedure.query(async ({ ctx}) => {
    const attendedObjects = await ctx.prisma.attended.findMany({
      where: {
        userId: ctx.currentUserId 
      }
    })
    const eventIds = attendedObjects.map(a => a.eventId)
    return ctx.prisma.event.findMany({
      where: {
        id: { in: eventIds }
      }
    })
  }), 
  getFutureEvents: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findMany({
      where: {
        date: {
          gte: (new Date()).toISOString()
        }
      }
    })
  })
});
