<script setup lang="ts">
import { ResultEnum, getAppEnvConfig, isString } from "@/lib";
import { componentSetting } from "@/lib/settings/component";
import type { UploadFileInfo } from "naive-ui";
import { useDialog, useMessage } from "naive-ui";
import { computed, ref, watch } from "vue";

interface Props {
  modelValue?: string[];
  width?: number;
  height?: number;
  maxSize?: number;
  accept?: string;
  helpText?: string;
  maxNumber?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  width: 104,
  height: 104,
  maxSize: 2,
  accept: ".jpg,.png,.jpeg,.svg,.gif",
  helpText: "",
  maxNumber: Infinity
});

const emit = defineEmits<{
  uploadChange: [value: string[]];
  delete: [value: string[]];
}>();

const { VITE_GLOB_FILE_URL: fileUrl } = getAppEnvConfig();
const message = useMessage();
const dialog = useDialog();

const isPreviewVisible = ref(false);
const previewImageUrl = ref("");
const originalImageList = ref<string[]>([]);
const displayImageList = ref<string[]>([]);

const containerStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`
}));

const canUploadMore = computed(() => displayImageList.value.length < 6);

watch(
  () => props.modelValue,
  () => {
    displayImageList.value = props.modelValue.map((item) => buildImageUrl(item));
    originalImageList.value = [...props.modelValue];
  },
  { immediate: true }
);

const showImagePreview = (url: string) => {
  isPreviewVisible.value = true;
  previewImageUrl.value = url;
};

const removeImage = (index: number) => {
  dialog.info({
    title: "提示",
    content: "你确定要删除吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      displayImageList.value.splice(index, 1);
      originalImageList.value.splice(index, 1);
      emit("uploadChange", originalImageList.value);
      emit("delete", originalImageList.value);
    }
  });
};

const buildImageUrl = (url: string): string => {
  return /(^http|https:\/\/)/g.test(url) ? url : `${fileUrl}${url}`;
};

const isValidFileType = (fileType: string) => {
  return componentSetting.upload.fileType.includes(fileType);
};

const validateBeforeUpload = ({ file }: { file: UploadFileInfo }) => {
  const fileInfo = file.file!;
  const { maxSize, accept } = props;
  const acceptedTypes = (isString(accept) && accept.split(",")) || [];

  if (maxSize && fileInfo.size / 1024 / 1024 >= maxSize) {
    message.error(`上传文件最大值不能超过${maxSize}M`);
    return false;
  }

  if (acceptedTypes.length > 0 && !isValidFileType(fileInfo.type)) {
    const fileType = componentSetting.upload.fileType;
    message.error(`只能上传文件类型为${fileType.join(",")}`);
    return false;
  }

  return true;
};

const handleUploadComplete = ({
  file,
  event
}: {
  file: UploadFileInfo;
  event?: ProgressEvent<EventTarget>;
}) => {
  try {
    const target = event?.target as XMLHttpRequest;
    const res = JSON.parse(target.response);
    const infoField = componentSetting.upload.apiSetting.infoField;
    const { code } = res;
    const errorMessage = res.msg || res.message || "上传失败";
    const result = res[infoField];

    if (code === ResultEnum.SUCCESS) {
      const imageUrl: string = buildImageUrl(result.photo);
      displayImageList.value.push(imageUrl);
      originalImageList.value.push(result.photo);
      emit("uploadChange", originalImageList.value);
    } else {
      message.error(errorMessage);
    }
  } catch (error) {
    message.error("上传响应解析失败");
  }
};
</script>

<template>
  <div class="w-full">
    <div class="w-full overflow-hidden">
      <div class="flex h-auto w-auto flex-wrap items-center">
        <div
          v-for="(item, index) in displayImageList"
          :key="`img_${index}`"
          class="group relative mr-2 mb-2 flex flex-col items-center justify-center rounded-sm border border-gray-300 p-2"
          :style="containerStyle"
        >
          <div class="relative h-full w-full overflow-hidden p-0">
            <div class="relative h-full rounded-sm">
              <img :src="item" class="h-full w-full object-cover" />
            </div>
            <div
              class="bg-opacity-50 absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
            <div
              class="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <SvgIcon
                icon="ant-design:eye-outlined"
                class="text-opacity-85 mx-2 cursor-pointer text-lg text-white hover:text-white"
                @click="showImagePreview(item)"
              />
              <SvgIcon
                icon="ant-design:delete-outlined"
                class="text-opacity-85 mx-2 cursor-pointer text-lg text-white hover:text-white"
                @click="removeImage(index)"
              />
            </div>
          </div>
        </div>

        <n-upload
          v-if="canUploadMore"
          class="w-full"
          v-bind="$props"
          :file-list-style="{ display: 'none' }"
          @before-upload="validateBeforeUpload"
          @finish="handleUploadComplete"
        >
          <div
            class="relative mr-2 mb-2 flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-gray-300 bg-gray-50 p-2 text-gray-600"
            :style="containerStyle"
          >
            <div class="flex w-full flex-col items-center justify-center">
              <SvgIcon icon="ant-design:plus-outlined" class="mx-auto mb-1 text-lg" />
              <span class="text-sm text-gray-600">上传图片</span>
            </div>
          </div>
        </n-upload>
      </div>
    </div>

    <n-space v-if="helpText" class="mt-4">
      <n-alert title="提示" type="info" class="flex w-full">
        {{ helpText }}
      </n-alert>
    </n-space>
  </div>

  <n-modal
    v-model:show="isPreviewVisible"
    preset="card"
    title="预览"
    :bordered="false"
    :style="{ width: '520px' }"
  >
    <img :src="previewImageUrl" class="h-auto w-full" />
  </n-modal>
</template>
