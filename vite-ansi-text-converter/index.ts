import fs from 'fs/promises'
import { basename } from 'path'
import { HTMLElement, Node, parse, TextNode } from 'node-html-parser'
import type { Plugin, ViteDevServer } from 'vite'

interface ConversionContext {
  links: string[];
}

const mkForegroundFromId = (colorId: string) => `\x1b[38;5;${colorId}m`;
const mkForegroundFromRgb = (red: number, green: number, blue: number) => `\x1b[38;2;${red};${green};${blue};m`;
const mkForegroundFromHex = (color: string) => mkForegroundFromRgb(parseInt(color.substring(0, 2), 16), parseInt(color.substring(2, 4), 16), parseInt(color.substring(4, 6), 16))
const nord7 = mkForegroundFromHex('8fbcbb')
const nord8 = mkForegroundFromHex('88c0d0')
const reset = "\x1b[0m";

export default function ansiTextConverter(): Plugin {
  let viteConfig: any = null

  const contents: Record<string, string> = {};

  return {
    name: 'vite-ansi-text-converter',

    configResolved(config) {
      viteConfig = config
    },

    transformIndexHtml: {
      order: 'post',
      handler: async (html, { filename }) => {
        return await processIncludes(html, filename)
      },
    },

    closeBundle() {
      if (viteConfig.command == "serve") {
        return
      }

      Object.entries(contents).forEach(async ([key, value]) => {
        const path = `dist/${key}`;
        await fs.writeFile(path, value)
      })
    },

    configureServer(server: ViteDevServer): void {
      server.middlewares.use((req, res, next) => {
        const uri = new URL(req.originalUrl!, `http://${req.headers.host}`)
        const pathname = uri.pathname.substring(1)

        if (contents[pathname]) {
          res.writeHead(200, {
            'Content-Type': "text/plain",
          })
          res.write(contents[pathname])
          res.end()
        }
        else {
          next()
        }
      })
    }
  }

  async function processIncludes(
    inputHtml: string,
    sourceFile: string | null = null
  ): Promise<string> {
    if (!sourceFile) {
      console.error('Got no filename, cant convert')
      return inputHtml
    }

    const root = parse(inputHtml, {
      lowerCaseTagName: false,
      blockTextElements: {
        script: true,
        noscript: true,
        style: true,
        pre: true,
      },
    })

    const conversionContext: ConversionContext = {
      links: []
    };

    const elements = root.querySelectorAll('.content');
    const textVersion = elements.reduce((acc, cur) => acc + processRootElement(cur, conversionContext), '')
      + appendLinks(conversionContext);

    const name = basename(sourceFile, ".html")
    contents[name] = textVersion

    return inputHtml;
  }

  function getText(element: Node) {
    return element.text
      .replace(/^\s*(\S)/gm, '$1')
      .trim();
  }

  function processNodes(node: Node, context: ConversionContext): string {

    return node.childNodes.reduce((acc, node) => `${acc}${processNode(node, context)}`, '');
  }

  function processNode(node: Node, context: ConversionContext): string {
    if (node instanceof HTMLElement) {
      switch (node.rawTagName) {
        case 'h1':
          return `${nord7}${processNodes(node, context)}${reset}\n\n`;
        case 'a':
          const linkId = context.links.length;
          context.links.push(node.getAttribute("href") ?? '')
          return ` ${getText(node)}${nord8}[${linkId}]${reset}`;
        case 'p':
          return `${processNodes(node, context)}\n`;
      }
    } else if (node instanceof TextNode) {
      return getText(node);
    }

    return '';
  }


  function processRootElement(element: HTMLElement, context: ConversionContext): string {
    return element.childNodes.reduce((acc, node) => `${acc}${processNode(node, context)}`, '');
  }

  function appendLinks(context: ConversionContext): string {
    if (context.links.length === 0) {
      return '';
    }

    return context.links.reduce((acc, link, index) => `${acc}  ${nord8}[${index}]${reset} ${link}\n`, '\n')
  }
}

