import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TypewriterTextProps {
  text: string;
  think: string;
  speed?: number;
  isDarkMode: boolean;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  think,
  speed = 2,
  onComplete,
  isDarkMode
}) => {
  const [thinkText, setThinkText] = useState('');
  const [mainText, setMainText] = useState('');
  const [phase, setPhase] = useState<'thinking' | 'thought' | 'main'>('thinking');
  const startTimeRef = useRef(Date.now());

  const MarkdownRenderer = ({ content }: { content: string }) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code: function Code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus as any}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        blockquote: ({ children }) => (
          <blockquote
            className={`border-l-4 pl-4 my-4 italic p-3 rounded ${
              isDarkMode
                ? 'border-gray-500 bg-gray-900 text-gray-200'
                : 'border-gray-400 bg-gray-100 text-gray-800'
            }`}
          >
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  // Helper function to animate text display
  const animateText = (
    textToAnimate: string,
    setter: (text: string) => void,
    chunkSize: number,
    onComplete?: () => void
  ) => {
    let index = 0;
    let lastUpdateTime = Date.now();

    const animate = () => {
      const now = Date.now();
      if (now - lastUpdateTime >= speed) {
        if (index < textToAnimate.length) {
          const chunk = textToAnimate.slice(0, index + chunkSize);
          setter(chunk);
          index += chunkSize;
          lastUpdateTime = now;
          requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!think) {
      setPhase('main');
      animateText(text, setMainText, 5, onComplete);
      return;
    }

    startTimeRef.current = Date.now();
    animateText(think, setThinkText, 3, () => {
      const thinkTime = Math.round((Date.now() - startTimeRef.current) / 1000); // Convert to seconds
      setPhase('thought');

      setTimeout(() => {
        setPhase('main');
        animateText(text, setMainText, 5, onComplete);
      }, 300);
    });
  }, [text, think, onComplete]);

  const renderThinking = () => {
    if (!think) return null;
    const thinkTime = Math.round((Date.now() - startTimeRef.current) / 1000); // Convert to seconds
    const header = phase === 'thinking' ? '*Thinking...*' : `*Thought for ${thinkTime}ms*`;
    
    // Format the content to ensure proper blockquote rendering
    const blockquoteContent = `${header}\n\n${thinkText}`;
    return (
      <div className="mb-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            blockquote: ({ children }) => (
              <blockquote
                className={`border-l-4 pl-4 my-4 italic p-3 rounded ${
                  isDarkMode
                    ? 'border-gray-500 bg-gray-900 text-gray-200'
                    : 'border-gray-400 bg-gray-100 text-gray-800'
                }`}
              >
                {children}
              </blockquote>
            ),
          }}
        >
          {`> ${blockquoteContent.split('\n').join('\n> ')}`}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="typewriter-container space-y-4">
      {thinkText && renderThinking()}
      {mainText && <MarkdownRenderer content={mainText} />}
    </div>
  );
};