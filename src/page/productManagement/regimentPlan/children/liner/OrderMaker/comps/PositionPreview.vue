<style lang="scss" scoped>
.position-preview{
  border-bottom: 1px solid #f4f4f4;
  width: 320px;
  ol, ul {
    list-style: none;
  }
  ul, li{
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    cursor: pointer;
  }
  .list-outer{
    padding-top: 10px;
    width: 100%;
    .list-main{
      display: flex;
      box-sizing: border-box;
      &>div{
        box-sizing: border-box;
        font-size: 14px;
        line-height: 2;
      }
      &>div:nth-child(1){
        text-align: center;
        width: 28px;
      }
      &>div:nth-child(2){
        text-align: left; width: 92px;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &>div:nth-child(3), &>div:nth-child(4){
        text-align: right; width: 100px;
      }
    }
  }
}
</style>

<template>
  <div class="position-preview">

    <div class="list-outer">
      <div class="list-main">
        <div>
          <i class="el-icon-arrow-down"></i>
        </div>
        <div>完整房间</div>
        <div>28 间</div>
        <div>可住 60 人</div>
      </div>
      <ul>
        <li>
          <div class="list-main">
            <div></div>
            <div>123123123123123123123123123123123123123123123123123123123123</div>
            <div></div>
            <div></div>
          </div>
        </li>
      </ul>
    </div>

    <div class="list-outer">
      <div class="list-main">
        <div>
          <i class="el-icon-arrow-down"></i>
        </div>
        <div>拼住房间</div>
        <div>28 间</div>
        <div>可住 60 人</div>
      </div>
      <ul>
        <li>
          <div class="list-main">
            <div></div>
            <div>123123123123123123123123123123123123123123123123123123123123</div>
            <div></div>
            <div></div>
          </div>
        </li>
      </ul>
    </div>

    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {

}
</script>