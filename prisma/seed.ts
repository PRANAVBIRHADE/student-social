import bcrypt from "bcrypt";
import { PrismaClient, PostVisibility } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const [alex, jordan, priya] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alex Rivera",
        email: "alex@student.edu",
        passwordHash,
        college: "Northbridge University",
        department: "Computer Science",
        year: 3,
        bio: "Building tools for students and mentoring first-years.",
        profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
        coverImage:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jordan Lee",
        email: "jordan@student.edu",
        passwordHash,
        college: "Northbridge University",
        department: "Design",
        year: 2,
        bio: "Design lead for the campus hackathon, coffee-powered.",
        profileImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
        coverImage:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Sharma",
        email: "priya@student.edu",
        passwordHash,
        college: "Northbridge University",
        department: "Business",
        year: 4,
        bio: "Organizing events and sharing study sprints.",
        profileImage: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
        coverImage:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80",
      },
    }),
  ]);

  await prisma.post.createMany({
    data: [
      {
        authorId: alex.id,
        content:
          "Compiled a starter pack for the OS finals. Includes diagrams, past questions, and flashcards. Good luck everyone!",
        mediaUrls: [],
        tags: ["#os", "#exam", "#study"],
        visibility: PostVisibility.PUBLIC,
        likesCount: 2,
        commentsCount: 2,
      },
      {
        authorId: jordan.id,
        content:
          "Motion design workshop this Friday! Bringing free figma templates and a mini brand kit.",
        mediaUrls: [],
        tags: ["#design", "#events", "#workshop"],
        visibility: PostVisibility.PUBLIC,
        likesCount: 1,
        commentsCount: 1,
      },
      {
        authorId: priya.id,
        content:
          "Launching a peer-mentorship group for first-years. DM if you want to volunteer or find a mentor.",
        mediaUrls: [],
        tags: ["#mentorship", "#community"],
        visibility: PostVisibility.PUBLIC,
        likesCount: 1,
        commentsCount: 0,
      },
    ],
  });

  const createdPosts = await prisma.post.findMany({ orderBy: { createdAt: "asc" } });

  await Promise.all([
    prisma.comment.create({
      data: {
        postId: createdPosts[0].id,
        authorId: jordan.id,
        content: "This is gold, thanks for sharing. Adding it to our study group.",
      },
    }),
    prisma.comment.create({
      data: {
        postId: createdPosts[0].id,
        authorId: priya.id,
        content: "Perfect timing! Could we add a section on scheduling tips?",
      },
    }),
    prisma.comment.create({
      data: {
        postId: createdPosts[1].id,
        authorId: alex.id,
        content: "Count me in. Can we record the session for remote students?",
      },
    }),
  ]);

  await Promise.all([
    prisma.like.createMany({
      data: [
        { userId: jordan.id, postId: createdPosts[0].id },
        { userId: priya.id, postId: createdPosts[0].id },
        { userId: alex.id, postId: createdPosts[1].id },
        { userId: priya.id, postId: createdPosts[2].id },
      ],
    }),
    prisma.follow.createMany({
      data: [
        { followerId: alex.id, followingId: jordan.id },
        { followerId: alex.id, followingId: priya.id },
        { followerId: jordan.id, followingId: alex.id },
        { followerId: priya.id, followingId: alex.id },
      ],
    }),
    prisma.message.createMany({
      data: [
        {
          fromId: alex.id,
          toId: jordan.id,
          content: "Want to co-host a design x dev meetup next week?",
        },
        {
          fromId: jordan.id,
          toId: alex.id,
          content: "Yes! Let’s draft a quick agenda after class.",
        },
      ],
    }),
  ]);

  await prisma.notification.createMany({
    data: [
      {
        userId: alex.id,
        type: "COMMENT",
        payload: { postId: createdPosts[0].id, from: jordan.id },
      },
      {
        userId: jordan.id,
        type: "LIKE",
        payload: { postId: createdPosts[1].id, from: alex.id },
      },
      {
        userId: priya.id,
        type: "FOLLOW",
        payload: { from: alex.id },
      },
    ],
  });
}

seed()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

