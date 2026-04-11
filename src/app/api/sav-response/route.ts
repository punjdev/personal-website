import { NextResponse } from "next/server";

type SavEvent = "restaurant_selected" | "date_accepted";

type SavResponsePayload = {
  event: SavEvent;
  restaurantName: string;
  restaurantUrl?: string;
  submittedAt?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SavResponsePayload;
    const record = {
      event: body.event,
      restaurantName: body.restaurantName,
      restaurantUrl: body.restaurantUrl ?? null,
      submittedAt: body.submittedAt ?? new Date().toISOString(),
    };

    console.log("[sav-response]", JSON.stringify(record));

    return NextResponse.json({
      ok: true,
      savedToLogs: true,
    });
  } catch (error) {
    console.error("[sav-response-error]", error);

    return NextResponse.json(
      { ok: false, error: "Failed to save sav response" },
      { status: 500 },
    );
  }
}
