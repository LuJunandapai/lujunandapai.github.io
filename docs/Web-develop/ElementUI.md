---
title: Element UI 组件
date: 2023/04/26
---

# Element UI



# elementUI  表单 

## 组件只读或禁用

https://blog.csdn.net/jizhou007/article/details/112918228

### 1.输入框的只读或禁用

```html
<!--只读-->
<el-form-input :readonly="true"></el-form-input>
<!--禁用-->
<el-form-input :disabled="true"></el-form-input>
```

### 2.select下拉框的禁用

```html
<el-select :disabled="true">
</el-select>
```

### 3.table表格中的 选择框的禁用

```html
<el-table>
    <el-table-column :selectable = "selectable" type = "selection">
        多选框
    </el-table-column>
    <el-table-column>
        第一列
    </el-table-column>
    <el-table-column>
        第二列
    </el-table-column>
</el-table>

methods:{
	selectable(){
		return false;
	}
}
```

## 时间表单 的格式

> elementUI  时间会自动转换 字符串  当数据库为时间类型  可以直接使用字符串条件

```html
<el-form-item label="业务日期: ">
    <template>
        <div class="block">
            <el-date-picker v-model="mincreatetime" type="date" placeholder="选择日期"
                            ormat="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
            </el-date-picker>
        </div>
    </template>
</el-form-item>
```





# elementUI  表格

## 遍历根据状态判断

```html
<el-table-column prop="status" label="状态" >
    <template slot-scope="scope">
        <span v-if="scope.row.status == '0'">等待审核</span>
        <span v-if="scope.row.status == '1'">通过审核</span>
        <span v-if="scope.row.status == '2'">审核失败</span>
    </template>
</el-table-column>
```

## 获取表格选中的所有数据

**具体详见**:  https://blog.csdn.net/loveLifeLoveCoding/article/details/116693763

```html
// 第一种 代码实现：
// 1. 在<el-table >添加属性 ref = "multipleTable " ,
<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
@selection-change="handleSelectionChange">
    // 2. 在<el-table-colum> 添加type属性 type=" selection "  多选框
    <el-table-column select="selection" type="selection" width="55" ref="multipleTable">
    </el-table-column>
</el-table>
// 3. 再通过一下代码就能获取已选择的行的数据；
this.$refs.multipleTable.selection
```

## 表格遍历 插入输入框

> 表格遍历 插入输入框 使用 v-model 绑定创建行对象字段数据

```html
<el-table-column label="数量">
    <template slot-scope="scope">
        <el-input v-model.number="scope.row.goodsNum" @change="jisuan(scope)"></el-input>
    </template>
</el-table-column>
```

## 表格每行数据具有index索引

```html
<el-table ref="multipleTable" :data="goodslist" height="250" border style="width: 100%" :row-class-name="tableRowClassName">
</el-table>

// 给每条数据添加一个索引
tableRowClassName(row, index){
row.row.index = row.rowIndex
},
```

## 表格 滚动条隐藏

```html
<style scoped>
.el-table--scrollable-y ::-webkit-scrollbar {
  display: none;
}
</style>
```

























