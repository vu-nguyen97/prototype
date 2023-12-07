export interface Group {
  id: number; // chỉ tăng
  listing?: string;
  // Luôn lưu vào state thay vì antd form để check được form có lỗi hay ko ngay lập tức
  // (thay vì lúc đó mới get value)
  creatives?: any;
}

export interface Listing {
  id: string;
  listingName?: string;
  appIconUrl?: string;
}
