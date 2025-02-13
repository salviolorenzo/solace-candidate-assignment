import { ilike, or, sql } from "drizzle-orm";
import db from "../../../db";
import { Advocate, advocates } from "../../../db/schema";

enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

const PAGE_SIZE = 10;

export async function GET(request: Request): Promise<Response> {
  if (!db) {
    return Response.json({
      message: "Database not initialized",
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  try {
    const searchParams = request.url.split("?")[1];
    const page = searchParams
      ? new URLSearchParams(searchParams).get("page")
      : 1;
    const rawSearchTerm = searchParams
      ? new URLSearchParams(searchParams).get("search")
      : null;

    const searchTerm = sanitizeSearchTerm(rawSearchTerm);

    const pageNumber = parseInt(page as string, 10) || 1;
    const data = await getAdvocates(pageNumber, searchTerm);

    if (!data || data.length === 0) {
      return Response.json({
        message: "No advocates found",
        status: HttpStatus.NOT_FOUND,
      });
    }

    return Response.json({ data, status: HttpStatus.OK });
  } catch (error) {
    console.error(error);
    return Response.json({
      error: "Error fetching advocates",
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

const getAdvocates = async (
  pageNumber: number,
  searchTerm: string | null
): Promise<Advocate[]> => {
  const offset = (pageNumber - 1) * PAGE_SIZE;

  if (!db) {
    throw new Error("Database not initialized");
  }

  // TODO: add filtering on specialties array
  return await db
    .select()
    .from(advocates)
    .where(
      searchTerm
        ? or(
            ilike(advocates.firstName, `${searchTerm}%`),
            ilike(advocates.lastName, `${searchTerm}%`),
            ilike(advocates.city, `${searchTerm}%`),
            ilike(advocates.degree, `${searchTerm}%`),
            sql`CAST(${
              advocates.yearsOfExperience
            } AS text) ILIKE ${`${searchTerm}%`}`,
            sql`CAST(${
              advocates.phoneNumber
            } AS text) ILIKE ${`${searchTerm}%`}`
          )
        : undefined
    )
    .limit(PAGE_SIZE)
    .offset(offset);
};

const sanitizeSearchTerm = (term: string | null): string | null => {
  if (!term) return null;
  // Remove SQL injection patterns and special characters
  return term.replace(/['";\\%]/g, "");
};
