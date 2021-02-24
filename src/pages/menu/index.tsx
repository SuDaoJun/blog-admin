import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Table, Modal, Tree, TreeSelect, Tabs} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { StoreState } from '@/store/types'
import api from '@/api/index';
import { constantData } from '@/utils/utils';
import { FormValidate } from '@/utils/format';
import './index.scss'

const MenuList = (props: any) => {
  const { confirm } = Modal;
  const { TabPane } = Tabs;
  const [modalForm] = Form.useForm();
  let userInfo = props.stateData.userInfo;
  let [treeData, setTreeData] = useState<any[]>([])
  let [tableData, setTableData] = useState<any[]>([])
  let [modalTreeData, setModalTreeData] = useState<any[]>([])
  let [modalObj, setModalObj] = useState<any>({
    title: '',
    operType: '',
    visible: false,
    loading: false,
    treeDisabled: false,
    selectRow: {}
  })
  let tableColumns = [
    {
      title: '名称',
      className: 'font-16',
      dataIndex: 'title'
    },
    {
      title: '类别',
      width: '260px',
      className: 'font-16',
      dataIndex: 'menuId',
      render: (text:string, record:any) => (
        <span>
          {text?'功能':'菜单'}
        </span>
      )
    },
    {
      title: '操作',
      width: '260px',
      className: 'font-16',
      dataIndex: 'operate',
      render: (text:string, record:any) =>(
        <div className="node-box">
          {
            userInfo.roleId.functionList.includes('5e99c280d1ba729a78b016bd') && record.parentId !== "0"?<div className="box-btn" onClick={(e)=>{
              editData(record,e)
            }}>编辑</div>:''
          }
          {
            userInfo.roleId.functionList.includes('5e99c287d1ba729a78b016be') && record.parentId !== "0"?<div className="box-btn btn-del" onClick={(e)=>{
              delData(record,e)
            }}>删除</div>:''
          }
          {
            userInfo.roleId.functionList.includes('5e99c25ad1ba729a78b016bc') && ((!record.children && !record.menuId) || (record.functionList && record.functionList.length) > 0)?<div className="box-btn btn-add" onClick={(e)=>{addFunction(record,e)}}>新增功能</div>:''
          }
        </div>
      )
    }
  ]

  useEffect(() => {
    getTreeList()
  }, []);

  const getTreeList = ()=>{
    api.menu.menuTree({}).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        let treeList = res.data.data;
        let modalTree = [];
        let tableList = [];
        if(treeList.length > 0){
          modalTree = modalTreeHandle(treeList)
          tableList = tableHandle(treeList)
          treeList = treeHandle(treeList)
        }
        setModalTreeData([...modalTree])
        setTableData([...tableList])
        setTreeData([...treeList])
      }else{
        message.warning('获取菜单列表失败');
      }
    })
  }
  // 菜单新增
  const menuAdd = ()=>{
    modalObj.title = '新增菜单';
    modalObj.operType = 'addMenu';
    modalObj.treeDisabled = false;
    modalObj.selectRow = {};
    modalObj.visible = true;
    setModalObj({...modalObj})
  }
  const modalConfir = ()=>{
    modalForm.validateFields().then((values)=>{
      if(modalObj.operType === 'editMenu' && values.menuId === modalObj.selectRow._id){
        return message.warning('上级菜单不可选本身');
      }
      modalObj.loading = true;
      setModalObj({...modalObj})
      if(modalObj.operType === 'addMenu'){
        api.menu.menuAdd({
          title: values.title,
          parentId: values.menuId,
          description: values.description
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getTreeList();
          }else if(code === constantData.dataAlready){
            message.warning('菜单标题已存在');
            modalForm.setFieldsValue({ 
              title: ''
            })
          }else{
            message.warning('菜单标题添加失败');
          }
          setModalObj({...modalObj})
        })
      }else if(modalObj.operType === 'editMenu'){
        api.menu.menuUpdate({
          id: modalObj.selectRow._id,
          title: values.title,
          parentId: values.menuId,
          description: values.description
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getTreeList();
          }else if(code === constantData.statusFail){
            message.warning('上级菜单不可选本身');
          }else if(code === constantData.dataAlready){
            message.warning('菜单标题已存在');
            modalForm.setFieldsValue({ 
              title: ''
            })
          }else{
            message.warning('菜单标题编辑失败');
          }
          setModalObj({...modalObj})
        })
      }else if(modalObj.operType === 'addFunction'){
        api.menu.functionAdd({
          title: values.title,
          menuId: values.menuId,
          description: values.description
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getTreeList();
          }else if(code === constantData.dataAlready){
            message.warning('功能标题已存在');
            modalForm.setFieldsValue({ 
              title: ''
            })
          }else{
            message.warning('功能标题添加失败');
          }
          setModalObj({...modalObj})
        })
      }else if(modalObj.operType === 'editFunction'){
        api.menu.functionUpdate({
          id: modalObj.selectRow._id,
          title: values.title,
          menuId: values.menuId,
          description: values.description
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            modalForm.resetFields();
            getTreeList();
          }else if(code === constantData.dataAlready){
            message.warning('功能标题已存在');
            modalForm.setFieldsValue({ 
              title: ''
            })
          }else{
            message.warning('功能标题添加失败');
          }
          setModalObj({...modalObj})
        })
      }
    }).catch(()=>{});
  }
  const modalCancel = ()=>{
    modalObj.visible = false;
    modalForm.resetFields();
    setModalObj({...modalObj})
  }
  // 编辑数据
  const editData = (item:any, e:any)=>{
    e.stopPropagation()
    if(item.menuId){
      modalObj.title = '编辑功能';
      modalObj.operType = 'editFunction';
      modalObj.selectRow = item;
      modalObj.treeDisabled = false;
      modalObj.visible = true;
      modalForm.setFieldsValue({ 
        title: item.aliasTitle || item.title,
        menuId: item.menuId,
        description: item.description
      })
    }else{
      modalObj.title = '编辑菜单';
      modalObj.operType = 'editMenu';
      modalObj.selectRow = item;
      modalObj.treeDisabled = false;
      modalObj.visible = true;
      modalForm.setFieldsValue({ 
        title: item.aliasTitle || item.title,
        menuId: item.parentId,
        description: item.description
      })
    }
    setModalObj({...modalObj})
  }
  // 新增功能
  const addFunction = (item:any,e:any)=>{
    e.stopPropagation()
    modalObj.title = '新增功能';
    modalObj.operType = 'addFunction';
    modalObj.selectRow = item;
    modalObj.treeDisabled = true;
    modalObj.visible = true;
    modalForm.setFieldsValue({ 
      title: '',
      menuId: item._id,
      description: ''
    })
    setModalObj({...modalObj})
  }
  // 删除数据
  const delData = (item:any, e:any)=>{
    e.stopPropagation()
    if(item.functionList && item.functionList.length > 0){
      return message.warning('该菜单存在功能列表，请先删除功能')
    }
    let content = item.menuId?'此操作将删除该功能, 是否继续?':'此操作将删除该菜单, 是否继续?'
    confirm({
      title: '提示',
      content,
      closable: true,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          if(item.menuId){
            api.menu.functionDel(item._id).then((res)=>{
              let code = res.data.code;
              resolve('')
              if(code === constantData.reqSuccess){
                getTreeList();
              }else{
                message.warning('功能删除失败');
              }
            })
          }else{
            api.menu.menuDel(item._id).then((res)=>{
              let code = res.data.code;
              resolve('')
              if(code === constantData.reqSuccess){
                getTreeList();
              }else if(code === constantData.dataAlready){
                message.warning('该菜单存在功能列表，请先删除功能')
              }else{
                message.warning('菜单删除失败');
              }
            })
          }
        }).catch(() => {});
      }
    });
  }
  // 数据处理
  const treeHandle = (arr:any[])=>{
    arr.map((item:any)=>{
      if(item.functionList && item.functionList.length > 0){
        item.children = item.functionList
      }
      if (item.children && item.children.length > 0) {
        item.children = treeHandle(item.children)
      }
      item.key = item._id;
      item.aliasTitle = item.title;
      item.title = (
        <div className="tree-node">
          <div className="node-title">
            {item.menuId?<SettingOutlined style={{color: 'rgba(0, 0, 0,.4)'}} />:<i className='mio-icon-icon_caidan iconfont'></i>}
            <span>{item.title}</span>
          </div>
          <div className="node-box">
            {item.menuId?"功能":"菜单"}
          </div>
          <div className="node-box">
            {
              userInfo.roleId.functionList.includes('5e99c280d1ba729a78b016bd') && item.parentId !== "0"?<div className="box-btn" onClick={(e)=>{
                editData(item,e)
              }}>编辑</div>:''
            }
            {
              userInfo.roleId.functionList.includes('5e99c287d1ba729a78b016be') && item.parentId !== "0"?<div className="box-btn btn-del" onClick={(e)=>{
                delData(item,e)
              }}>删除</div>:''
            }
            {
              userInfo.roleId.functionList.includes('5e99c25ad1ba729a78b016bc') && ((!item.children && !item.menuId) || (item.functionList && item.functionList.length) > 0)?<div className="box-btn btn-add" onClick={(e)=>{addFunction(item,e)}}>新增功能</div>:''
            }
          </div>
        </div>
      )
    })
    return arr
  }
  const modalTreeHandle = (arr:any[])=>{
    let newArr = JSON.parse(JSON.stringify(arr))
    newArr.map((item:any)=>{
      if (item.children && item.children.length > 0) {
        item.children = modalTreeHandle(item.children)
      }
      item.value = item._id;
    })
    return newArr
  }
  const tableHandle = (arr:any[])=>{
    let newArr = JSON.parse(JSON.stringify(arr))
    newArr.map((item:any)=>{
      if(item.functionList && item.functionList.length > 0){
        item.children = item.functionList
      }
      if (item.children && item.children.length > 0) {
        item.children = tableHandle(item.children)
      }
    })
    return newArr
  }

  return <div className='menu-wrapper'>
    <h2 className='content-title'>菜单管理</h2>
    <div className="box-table" style={{paddingTop: '4px'}}>
      <Tabs defaultActiveKey="tree" size='large' tabBarExtraContent={
        userInfo.roleId.functionList.includes('5e99c25ad1ba729a78b016bc')?<Button type="primary" onClick={menuAdd}>新增菜单</Button>:''
      }>
        <TabPane tab="树形结构" key="tree">
        <div className="box-tree">
          <div className="list-header">
            <div className="header-title">名称</div>
            <div className="header-title">类别</div>
            <div className="header-title">操作</div>
          </div>
          <div className="list-tree">
          {
            treeData.length > 0 && <Tree
              blockNode={true}
              defaultExpandAll={true}
              treeData={treeData}
            />
          }
          </div>
        </div>
        </TabPane>
        <TabPane tab="表格结构" key="table">
          <Table rowKey='_id' columns={tableColumns} dataSource={tableData} pagination={false} expandable={
            {
              defaultExpandedRowKeys: tableData.length > 0?[tableData[0]._id]:[],
              expandRowByClick: true
            }
          }  />
        </TabPane>
      </Tabs>
    </div>
    <Modal  title={modalObj.title} maskClosable={false} confirmLoading={modalObj.loading} visible={modalObj.visible} onOk={modalConfir} onCancel={modalCancel}>
    <Form
        form={modalForm}
        validateTrigger='onBlur'
        labelCol={{ span: 4 }}
        requiredMark={false}
        scrollToFirstError
      >
        <Form.Item
          name="title"
          label="标题"
          rules={FormValidate({name: '标题'})}
        >
          <Input 
            maxLength={20} 
            allowClear={true} 
            placeholder="标题" 
          />
        </Form.Item>
        <Form.Item
          name="menuId"
          label="上级菜单"
          validateTrigger='onChange'
          rules={FormValidate({type: 'array',name: '上级菜单'})}
        >
          <TreeSelect
            placeholder='上级菜单'
            treeDefaultExpandAll={true}
            disabled={modalObj.treeDisabled}
            allowClear={true}
            treeData={modalTreeData}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
        >
          <Input 
            maxLength={80} 
            allowClear={true} 
            placeholder="描述" 
          />
        </Form.Item>
      </Form>
    </Modal>
  </div>;
}

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

export default connect(mapStateToProps)(MenuList)