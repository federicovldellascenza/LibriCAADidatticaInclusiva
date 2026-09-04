import { handleContactPost } from "../../worker/contact";

export async function onRequestPost(context: {
  request: Request;
  env: {
    CONTACT_TO_EMAIL?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
  };
}): Promise<Response> {
  return handleContactPost(context.request, context.env);
}
