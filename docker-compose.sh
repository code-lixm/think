#! /bin/bash
# 该脚本只保留生产环境运行所需文件到统一目录
if [ ! -f './config/prod.yaml' ]; then
  echo "缺少 config/prod.yaml 文件，可参考 docker-prod-sample.yaml 进行配置"
  exit 1
fi

# 构建
rm -rf runtime
docker-compose build
