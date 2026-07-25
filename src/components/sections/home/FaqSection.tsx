import prisma from "@/lib/prisma";
import FaqClient, { FaqItem } from "./FaqClient";

export default async function FaqSection() {
  const faqData = await prisma.faq.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedFaqs: FaqItem[] = faqData.map((item: any) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  if (formattedFaqs.length === 0) {
    return null;
  }

  return <FaqClient faqs={formattedFaqs} />;
}