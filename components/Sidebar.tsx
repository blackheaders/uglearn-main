import React from 'react';
import { ChevronDown, ChevronRight, FileText, Video, FolderIcon } from 'lucide-react';
import { Content } from '@/types/types';

interface SidebarProps {
  content: Content[];
  activeContent: Content | null;
  onContentSelect: (content: Content) => void;
}

const ContentItem: React.FC<{
  item: Content;
  activeContent: Content | null;
  onContentSelect: (content: Content) => void;
  level?: number;
}> = ({ item, activeContent, onContentSelect, level = 0 }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isActive = activeContent?.id === item.id;

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return isExpanded ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />;
      case 'video':
        return <Video className="w-4 h-4 flex-shrink-0" />;
      case 'pdf':
        return <FileText className="w-4 h-4 flex-shrink-0" />;
      default:
        return <FolderIcon className="w-4 h-4 flex-shrink-0" />;
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => {
          if (item.type === 'folder') {
            setIsExpanded(!isExpanded);
          } else {
            onContentSelect(item);
          }
        }}
        className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#4f5ed7]/10 ${
          isActive ? 'bg-[#4f5ed7]/20' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
      >
        {getIcon(item.type)}
        <span className="truncate text-sm">{item.title}</span>
      </button>
      {item.type === 'folder' && isExpanded && item.children && item.children.length > 0 && (
        <div className="w-full">
          {item.children.map((child) => (
            <ContentItem
              key={child.id}
              item={child}
              activeContent={activeContent}
              onContentSelect={onContentSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  content,
  activeContent,
  onContentSelect,
}) => {
  return (
    <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Course Content</h2>
      </div>
      <div className="py-2">
        {content.map((item) => (
          <ContentItem
            key={item.id}
            item={item}
            activeContent={activeContent}
            onContentSelect={onContentSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;