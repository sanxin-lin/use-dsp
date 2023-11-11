## use-dsp

其实 dsp 意思就是

- **data**
- **state**
- **parameter**

```ts
npm i use-dsp
yarn i use-dsp
pnpm i use-dsp

import useDSP from 'use-dsp'

interface IFetch {
  is_name: string | null;
  in_age: number | null;
  in_id: number | null;
  is_hobbies: string | null;
}
interface IState {
  name: string | undefined;
  age: number | undefined;
  id: number | undefined;
  hobbies: string[];
}
interface IParams {
  os_name: string | null;
  on_age: number | null;
  on_id: number | null;
  os_hobbies: string | null;
}

// state：表单数据（响应式）
// resetState：重置表单
// inputState：表格数据 转 表单数据
// outputState：表单数据 转 提交数据
const { state, resetState, inputState, outputState } = useDSP<IState, IParams, IFetch>({
  name: {
    default: 's',
    input: 'is_name',
    output: 'os_name',
    inputStrategy: 'string2Null',
    outputStrategy: 'string2Null',
  },
  age: {
    default: 2,
    input: 'in_id',
    output: 'on_age',
    inputStrategy: 'number2String',
    outputStrategy: 'string2Number',
  },
  id: {
    default: 2,
    input: 'in_id',
    output: 'on_id',
    inputStrategy: (v, data) => {
      // v 当前传入的值
      // data 传入的整行的数据
      return String(v);
    },
    outputStrategy: (v, state) => {
      // v 当前表单字段的值
      // state 整个表单的值
      return `${v}-${state.name}-${state.age}`;
    },
  },
  hobbies: {
    default: ['1', '2'],
    input: 'is_hobbies',
    output: 'os_hobbies',
    inputStrategy: 'string2ArrayoEmpty',
    outputStrategy: 'array2StringoNull',
  },
});

const handleInputState = () => {
  // 传入表格行数据
  inputState({
    is_name: 'sunshine_lin',
    in_age: 20,
    in_id: 1,
    is_hobbies: '1,2',
  });
  // { age: '1', hobbies: ['1', '2'], id: '1', name: 'sunshine_lin' };
};

const handleOutputState = () => {
  // 获取请求提交数据
  console.log(outputState());
  // {os_name: 'sunshine_lin', on_age: 1, on_id: '1-sunshine_lin-1', os_hobbies: '1,2'}
};
```

## 背景

在平时的开发中，**表格数据->(增加/编辑/查看)行->(增加/编辑)提交**，这是很常见且简单的业务，但是就是这些业务，我也发现一些问题

![](https://files.mdnice.com/user/23686/d55e5d7a-19b4-48be-9b65-1f6efc9c29d9.png)

首先我们来理性一下这些业务的逻辑

- 第一步：请求回表格的数据
- 第二步：点开(增加/编辑/查看)弹窗，如果是(编辑/查看)，则需要将表格行的数据传到弹窗中回显
- 第三部：如果是(编辑)弹窗，则需要把表单数据提交请求接口

我用一个图来概括大概就是：

![](https://files.mdnice.com/user/23686/7c0a31f7-cdff-4535-9487-da3ea0b4967b.png)

## 问题所在

我不知道其他公司怎么样，但是就拿我自身来举例子，公司的后端跟前端的命名规则是不同的

- **后端命名：** 请求方法+字段类型+字段含义+下划线命名(比如 in_name、os_user_id)
- **前端命名：** 字段含义+驼峰命名(比如 name、userId)

回到刚刚的业务逻辑，还是那张图，假如我们前端不去管命名的话，那么数据的传输是这样的，发现了很多人都懒得去转换后端返回的字段名，直接拿着后端的字段名去当做前端的表单字段名，但这是不符合前端规范的

![](https://files.mdnice.com/user/23686/b7b7812a-0102-4524-bc89-0a0bfdb3e650.png)

理想应该是表单要用前端的命名，比如这样

![](https://files.mdnice.com/user/23686/252db78a-da88-463b-8692-ca6891d38ad6.png)

但是很多前端就是懒得去转换，原因有多个：

- 开发者自身比较懒，或者没有规范意识
- 回显时要转一次，提交时还要再转一次，每次总是得写一遍

## 解决方案

所以能不能写一个工具，解放开发者的压力又能达到期望的效果呢？比如我开发一个工具，然后像下面这样在弹窗里用

- **state：** 响应式表单数据，可以用在弹窗表单中
- **resetState：** 重置表单
- **inputState：** 将表格行数据转成表单数据
- **outputState：** 将表单数据转成提交请求的数据

配置的含义如下：

- **default：** 表单字段默认值
- **input：** 转入的字段名
- **output：** 转出的字段名
- **inputStrategy：** 转入的转换策略，可以选择内置的，也可以自定义策略函数
- **outputStrategy：** 转出的转换策略，可以选择内置的，也可以自定义策略函数

![](https://files.mdnice.com/user/23686/274d5471-8a26-4564-b3fe-b9a27f3e5efd.png)

转入和转出策略，内置了一些，你也可以自定义，内置的有如下

![](https://files.mdnice.com/user/23686/a53f6a53-95f5-4ebe-8a93-afb001206cea.png)

下面是自定义策略函数的例子，必须要在策略函数中返回一个转换值

![](https://files.mdnice.com/user/23686/ee5dcd2f-98aa-4ecc-b5e6-04c29cddc663.png)

这样的话，当我们执行对应的转换函数之后，会得到我们想要的结果

![](https://files.mdnice.com/user/23686/3c5616a4-9fea-48f8-8915-f1497ec1a14a.png)

## 为啥不从一开始就转？

有人会问，为啥不从一开始请求表格数据回来的时候，就把数据转成前端的命名规范？

其实这个问题我也想过，但是设想一下，有一些表格如果只是单纯做展示作用，那么就没必要去转字段名了，毕竟不涉及任何的数据传递。

但是需要编辑或者查看弹窗的表格，就涉及到了行数据的传递，那么就需要转字段名
