import { Revenue } from './definitions';


export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};


// 获取menu的openkeys
/**
 * 自定义截取字符串函数
 * @param str 原字符串
 * @param start 开始位置
 * @param length 截取长度
 * @returns 截取的子字符串
 */
function customSubstr (str: string, start: number, length: number): string {
  // 检查开始位置是否超出字符串长度
  if (start >= str.length) {
      return ""; // 如果开始位置超出，返回空字符串
  }

  // 计算实际的子串长度，防止越界
  const actualLength = Math.min(length, str.length - start);
  return str.substring(start, start + actualLength);
}

/**
* 获取路径中所包含的键
* @param path 路径
* @returns 所要提取的字符串
* @note 示例：
* getOpenKeys("/dashboard/system-setting/admin-settings") => "system-setting"
* getOpenKeys("/dashboard/home-page/admin-settings") => "home-page"
*/
export  const  getOpenKeys = function(path: string): string {
  const keys: number[] = [];
  for (let i = 0; i < path.length; i++) {
      if (path[i] === '/') {
          keys.push(i);
      }
  }

  // 检查 keys 数组的大小是否足够
  if (keys.length < 3) {
      return ""; // 如果没有足够的 '/'，返回空字符串
  }

  return customSubstr(path, keys[1] + 1, keys[2] - keys[1] - 1);
}