import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const MAX_LIST = 200

export const list = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db
      .query('todos')
      .order('desc')
      .take(MAX_LIST)
    return todos
  },
})

export const get = query({
  args: { id: v.id('todos') },
  handler: async (ctx, args) => {
    return await ctx.db.get('todos', args.id)
  },
})

export const create = mutation({
  args: { description: v.string() },
  handler: async (ctx, args) => {
    const trimmed = args.description.trim()
    if (!trimmed) {
      throw new Error('Description is required')
    }
    return await ctx.db.insert('todos', {
      description: trimmed,
      completed: false,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('todos'),
    description: v.string(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const trimmed = args.description.trim()
    if (!trimmed) {
      throw new Error('Description is required')
    }
    await ctx.db.patch('todos', args.id, {
      description: trimmed,
      completed: args.completed,
    })
  },
})

export const remove = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, args) => {
    await ctx.db.delete('todos', args.id)
  },
})

export const toggleCompleted = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get('todos', args.id)
    if (!todo) {
      return
    }
    await ctx.db.patch('todos', args.id, { completed: !todo.completed })
  },
})
