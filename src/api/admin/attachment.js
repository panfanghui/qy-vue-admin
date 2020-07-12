import request from "@/utils/request";
import settings from "@/config/settings";
// 上传接口
export function UpLoad() {
  let url = settings.baseURL + "/admin/attachment/upload";
  return url;
}

