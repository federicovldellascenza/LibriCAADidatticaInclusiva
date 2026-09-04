import { handleContactPost, type ContactEnv } from "../../worker/contact";

export async function onRequestPost(context: {
  request: Request;
  env: ContactEnv;
}): Promise<Response> {
  return handleContactPost(context.request, context.env);
}
