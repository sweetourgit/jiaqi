import './index.scss';

let vmList= [];
let shareList= [];
let current= null;
const LinkTitleBar= {
  props: {
    dataList: Array,
    options: {
      type: Object,
      default(){
        return {
          // 是否有删除
          deletable: false,
        }
      }
    }
  },

  watch:{
    dataList: {
      deep: true,
      handler(nval, oval){
        if(!this.dataList) return;
        shareList.splice(0);
        shareList.push(...nval);
        if(nval> oval) this.clickHandler(nval.length- 1);
      }
    }
  },
  
  data(){
    return {
      marked: false,
      list: shareList,
    }
  },

  render: function(h){
    if(!this.marked){
      this.marked= true;
      vmList.push(this);
    }
    return this.list.length=== 0? null:
    <div class="title-bar" link-title-bar>
      <div class="control-btns">
        <i class="el-icon-d-arrow-left"></i>
      </div>
      <div class="scroll-container">
        <div class="scroll-body">
          {
            this.list.map((el, index) => {
              return <div class={{ 'bar-outer': true, selected: el.selected }}
                key={ el.id }
                onClick={ this.clickHandler.bind(this, index) }>
                <div class="title-text"
                  title={ el.label }>
                  { el.label }
                </div>
                {
                  this.options.deletable? <div class="close-btn"
                    onClick={ this.closeHandler.bind(this, index) }>
                    <i class="el-icon-close"></i>
                  </div>: null
                }
              </div>
            })
          }
        </div>
      </div>
      <div class="control-btns">
        <i class="el-icon-d-arrow-right"></i>
      </div>
    </div>
  },
  
  methods: {
    clickHandler(index){
      // if(!title) return this.$emit('select');
      // if(typeof title=== 'number') title= this.list.find(el => el.key=== title);
      // let find= this.list.find(el => el.selected);
      // if(!this.options.deletable)console.log(find, title, this.list)
      // if(!find || find=== title) return;
      // find.selected= false;
      // title.selected= true;
      // this.$forceUpdate();
      // this.$emit('select', title);
      if(current) current.selected= false;
      shareList[index].selected= true;
      current= shareList[index];
      this.$emit('select', index);
    },
    closeHandler(title){
      let index= this.list.findIndex(el => el=== title);
      this.$emit('close', index);
    },
  }
}

export default LinkTitleBar


/**
 * 

  <div class="title-bar" v-show="dataList.length">
    <div class="control-btns">
      <i class="el-icon-d-arrow-left"></i>
    </div>
    <div class="scroll-container">
      <div class="scroll-body">

        <div :class="['bar-outer', el.selected && 'selected']"
          v-for="el in dataList"
          :key="el.id"
          @click="clickHandler(el)">
          <div class="title-text"
            :title="el.label">
            {{ el.label }}
          </div>
          <div class="close-btn"
            v-show="options.deletable"
            @click.stop="closeHandler(el)">
            <i class="el-icon-close"></i>
          </div>
        </div>

      </div>
    </div>
    <div class="control-btns">
      <i class="el-icon-d-arrow-right"></i>
    </div>
  </div>

 * 
 */