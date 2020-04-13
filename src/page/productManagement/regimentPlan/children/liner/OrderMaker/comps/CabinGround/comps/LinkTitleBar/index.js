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
  
  beforeDestroy(){
    let index= vmList.find(vm => vm=== this);
    vmList.splice(index, 1);
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
      if(current) current.selected= false;
      if(index>= 0){
        shareList[index].selected= true;
        current= shareList[index];
      }
      vmList.forEach(vm => vm.$emit('select', index));
    },
    closeHandler(index, $event){
      $event.stopPropagation();
      vmList.forEach(vm => vm.$emit('close', index));
    },
  }
}

export default LinkTitleBar