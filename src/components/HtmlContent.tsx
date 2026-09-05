const ALLOWED_TAGS = new Set(["P", "UL", "OL", "LI", "STRONG", "EM", "BR", "B", "I"]);

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function cleanNode(node: Node): Node | DocumentFragment | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent ?? "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const element = node as Element;
  const children = document.createDocumentFragment();
  for (const child of Array.from(element.childNodes)) {
    const cleaned = cleanNode(child);
    if (cleaned) children.appendChild(cleaned);
  }

  if (!ALLOWED_TAGS.has(element.tagName)) {
    return children;
  }

  const next = document.createElement(element.tagName.toLowerCase());
  next.appendChild(children);
  return next;
}

export function sanitizeHtml(html: string): string {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const wrapper = document.createElement("div");
  for (const child of Array.from(parsed.body.childNodes)) {
    const cleaned = cleanNode(child);
    if (cleaned) wrapper.appendChild(cleaned);
  }
  return wrapper.innerHTML;
}

type Props = {
  html: string;
  className?: string;
};

export function HtmlContent({ html, className }: Props) {
  const trimmed = html.trim();
  if (!trimmed) return null;

  if (!looksLikeHtml(trimmed)) {
    return <p className={className}>{trimmed}</p>;
  }

  return (
    <div
      className={className ? `rich-text ${className}` : "rich-text"}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(trimmed) }}
    />
  );
}
