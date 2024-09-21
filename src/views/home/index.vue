<template>
  <div class="home-page-style">
    <div class="left-content">
      <!--      进行中的项目-->
      <div class="project-content">
        <div class="title-box">
          <div class="title-name">进行中的项目</div>
          <el-link type="primary" style="font-size: 16px">全部项目</el-link>
        </div>
        <div class="project-content-box">
          <el-row :gutter="10">
            <el-col v-for="item in state.projectList" :key="item.id">
              <div class="card-box-style">
                <el-card shadow="hover">
                  <div class="card-item-style">
                    <div class="title-box">
                      <img src="@/assets/home/message.png" alt="" />
                      <div class="project-name">{{ item.name }}</div>
                    </div>
                    <div class="message-box">{{ item.message }}</div>
                    <div class="group-box">
                      <div class="group-name">{{ item.group }}</div>
                      <div class="after-time-box">{{ item.afterTime }}</div>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="line-style" />
      <!--      动态-->
      <div class="dynamic-content">
        <div class="title-box">动态</div>
        <div class="dynamic-content-box">
          <div v-for="(item, index) in state.dynamicList" :key="index" class="dynamic-item">
            <div class="item-avatar">
              <img src="@/assets/home/avatar.jpg" alt="" />
            </div>
            <div class="item-content">
              <div class="item-content-detail">
                <span style="font-weight: 600">{{ item.userName }}</span> 在
                <el-link type="primary">{{ item.group }}</el-link>
                {{ item.operation }}
                <el-link type="primary">{{ item.operationName }}</el-link>
              </div>
              <div class="time-box">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-content">
      <div class="data-box">
        <div class="search-box">
          <span style="min-width: 90px; font-size: 18px; color: #333">数据查询</span>
          <el-input v-model="state.searchData" style="max-width: 250px" />
        </div>
        <div class="data-content">
          <div class="data-list-box">
            <div
              class="data-item"
              v-for="item in state.dataList"
              :key="item.value"
              :class="{ 'data-item-act': state.dataAct === item.value }"
              @click="changeDataAct(item.value)"
            >
              {{ item.label }}
            </div>
          </div>
          <div class="data-search-box">
            <el-button>查询</el-button>
          </div>
        </div>
      </div>
      <div class="exponential-box">
        <div id="chart_box" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, nextTick } from "vue"
import * as echarts from "echarts"

const state = reactive({
  projectList: [
    {
      id: "0",
      name: "消息列表体验优化",
      group: "蜂鸟项目组",
      message: "这是一条描述信息这是一条描述信息这是一条描述信息",
      createTime: "2024-06-26",
      afterTime: "5 小时前"
    },
    {
      id: "1",
      name: "消息列表体验优化",
      group: "蜂鸟项目组",
      message: "这是一条描述信息这是一条描述信息这是一条描述信息",
      createTime: "2024-06-26",
      afterTime: "5 小时前"
    },
    {
      id: "2",
      name: "消息列表体验优化",
      group: "蜂鸟项目组",
      message: "这是一条描述信息这是一条描述信息这是一条描述信息",
      createTime: "2024-06-26",
      afterTime: "5 小时前"
    },
    {
      id: "3",
      name: "消息列表体验优化",
      group: "蜂鸟项目组",
      message: "这是一条描述信息这是一条描述信息这是一条描述信息",
      createTime: "2024-06-26",
      afterTime: "5 小时前"
    },
    {
      id: "4",
      name: "消息列表体验优化",
      group: "蜂鸟项目组",
      message: "这是一条描述信息这是一条描述信息这是一条描述信息",
      createTime: "2024-06-26",
      afterTime: "5 小时前"
    },
    {
      id: "5",
      name: "消息列表体验优化",
      group: "蜂鸟项目组",
      message: "这是一条描述信息这是一条描述信息这是一条描述信息",
      createTime: "2024-06-26",
      afterTime: "5 小时前"
    },
    {
      id: "6",
      name: "消息列表体验优化",
      group: "蜂鸟项目组",
      message: "这是一条描述信息这是一条描述信息这是一条描述信息",
      createTime: "2024-06-26",
      afterTime: "5 小时前"
    },
    {
      id: "7",
      name: "消息列表体验优化",
      group: "蜂鸟项目组",
      message: "这是一条描述信息这是一条描述信息这是一条描述信息",
      createTime: "2024-06-26",
      afterTime: "5 小时前"
    },
    {
      id: "8",
      name: "消息列表体验优化",
      group: "蜂鸟项目组",
      message: "这是一条描述信息这是一条描述信息这是一条描述信息",
      createTime: "2024-06-26",
      afterTime: "5 小时前"
    }
  ],
  dynamicList: [
    {
      userName: "小救星",
      group: "双叶幼稚园",
      operation: "开设",
      operationName: "向日葵班级",
      time: "2 小时前"
    },
    {
      userName: "小救星",
      group: "双叶幼稚园",
      operation: "开设",
      operationName: "向日葵班级",
      time: "2 小时前"
    },
    {
      userName: "小救星",
      group: "双叶幼稚园",
      operation: "开设",
      operationName: "向日葵班级",
      time: "2 小时前"
    },
    {
      userName: "小救星",
      group: "双叶幼稚园",
      operation: "开设",
      operationName: "向日葵班级",
      time: "2 小时前"
    },
    {
      userName: "小救星",
      group: "双叶幼稚园",
      operation: "开设",
      operationName: "向日葵班级",
      time: "2 小时前"
    },
    {
      userName: "小救星",
      group: "双叶幼稚园",
      operation: "开设",
      operationName: "向日葵班级",
      time: "2 小时前"
    }
  ],
  searchData: "",
  dataList: [
    {
      value: "1",
      label: "毒情数据"
    },
    {
      value: "2",
      label: "污水数据"
    },
    {
      value: "3",
      label: "案件数据"
    },
    {
      value: "4",
      label: "实验室数据"
    },
    {
      value: "5",
      label: "其它数据..."
    }
  ],
  dataAct: "1",
  option: {}
})

const changeDataAct = (value) => {
  state.dataAct = value
}

const initCharts = () => {
  const myChart = echarts.init(document.getElementById("chart_box"))

  // 指定图表的配置项和数据
  const option = {
    title: {
      text: ""
    },
    legend: {
      data: ["个人", "团队", "部门"]
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: "毒情", max: 100 },
        { name: "产量", max: 100 },
        { name: "贡献", max: 100 },
        { name: "实验室", max: 100 },
        { name: "污水", max: 100 }
      ]
    },
    series: [
      {
        name: "数据指数",
        type: "radar",
        emphasis: {
          areaStyle: {
            color: "rgba(0,250,0,0.3)"
          }
        },
        data: [
          {
            value: [42, 30, 20, 75, 50],
            name: "个人"
          },
          {
            value: [50, 40, 80, 26, 42],
            name: "团队"
          },
          {
            value: [70, 99, 72, 60, 33],
            name: "部门"
          }
        ]
      }
    ]
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}

// 初始化加载
nextTick(() => {
  setTimeout(() => {
    initCharts()
  }, 500)
})
</script>

<style lang="scss" scoped>
.home-page-style {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  @include flex-left;

  .left-content {
    width: 70%;
    height: 100%;
    @include flex-column-start;

    .project-content {
      width: 100%;
      height: 60%;
      @include flex-column-start;

      .title-box {
        @include flex-between-center;
        padding: 10px;

        .title-name {
          font-size: 18px;
          color: #000;
        }
      }

      .project-content-box {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0 5px;

        .card-box-style {
          margin-bottom: 10px;

          .card-item-style {
            height: 150px;
            overflow: hidden;
            cursor: pointer;

            .title-box {
              width: 100%;
              height: 40px;
              @include flex-left;

              img {
                width: 20px;
              }

              .project-name {
                font-size: 16px;
                color: #333;
                margin-left: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
              }
            }

            .message-box {
              width: 100%;
              height: 60px;
              margin-bottom: 20px;
              //background-color: skyblue;
              line-height: 28px;
              color: #666;
              padding: 8px 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }

            .group-box {
              width: 100%;
              height: 30px;
              //background-color: skyblue;
              @include flex-between-center;
              padding: 0 10px;
              font-size: 15px;
              color: #666;
            }
          }

          .card-item-style:hover {
            .project-name {
              color: #409eff;
            }

            .group-name {
              color: #409eff;
            }

            .message-box {
              color: rgba(64, 158, 255, 0.85);
            }
          }
        }
      }
    }

    .line-style {
      width: 100%;
      height: 1px;
      background-color: #e3e3e3;
      //margin: 10px 0;
      margin-bottom: 10px;
    }

    .dynamic-content {
      flex: 1;
      height: 0;
      //background-color: skyblue;
      //margin-top: 20px;
      @include flex-column-start;

      .title-box {
        font-size: 18px;
        color: #000;
      }

      .dynamic-content-box {
        flex: 1;
        height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        //border: 1px solid #eee;

        .dynamic-item {
          width: 100%;
          min-height: 100px;
          border-bottom: 1px solid #eee;
          //margin-bottom: 10px;
          @include flex-left;
          padding: 10px;

          .item-avatar {
            width: 80px;
            height: 100%;
            margin-right: 10px;

            img {
              width: 55px;
              height: 55px;
              border-radius: 50%;
              //margin: 10px 0 0 10px;
            }
          }

          .item-content {
            flex: 1;
            width: 0;
            height: 100%;

            .item-content-detail {
              color: #333;
              line-height: 28px;
            }

            .time-box {
              color: #666;
            }
          }
        }
      }
    }
  }

  .right-content {
    flex: 1;
    width: 0;
    padding: 10px 20px;
    @include flex-column-start;

    .data-box {
      width: 100%;
      //height: 30%;
      background-color: #fff;

      .search-box {
        width: 100%;
        @include flex-left-center;
      }

      .data-content {
        width: 100%;
        @include flex-left-start;
        margin-top: 20px;

        .data-list-box {
          flex: 1;

          .data-item {
            display: inline-block;
            margin-right: 30px;
            margin-bottom: 10px;
            font-size: 16px;
            color: #333;
            cursor: pointer;
          }

          .data-item-act {
            color: #409eff;
          }
        }
      }
    }

    .exponential-box {
      flex: 1;
      height: 0;
      margin-top: 10px;

      #chart_box {
        width: 100%;
        height: 100%;
      }
    }
  }
}

@media screen and (min-width: 1600px) {
  .el-col {
    max-width: 25%;
    width: 25%;
    flex: 0 0 25%;
  }
}

@media screen and (min-width: 1000px) and (max-width: 1600px) {
  .el-col {
    max-width: 33.33%;
    width: 33.33%;
    flex: 0 0 33.33%;
  }
}

@media screen and (min-width: 500px) and (max-width: 1000px) {
  .el-col {
    max-width: 50%;
    width: 50%;
    flex: 0 0 50%;
  }
}

@media only screen and (max-width: 500px) {
  .el-col {
    max-width: 100%;
    width: 100%;
    flex: 0 0 100%;
  }
}

// 隐藏滚动条
::-webkit-scrollbar {
  display: none;
}
</style>
