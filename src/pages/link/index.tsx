import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Space, Table, Modal } from 'antd';
import { connect } from 'react-redux'
import { StoreState } from '@/store/types'
import api from '@/api/index';
import { constantData } from '@/utils/utils';
import { FormValidate } from '@/utils/format';
import InputColor from 'react-input-color';

const Link = (props: any) => {
  const { confirm } = Modal;
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  let userInfo = props.stateData.userInfo;
  let [tableData, setTableData] = useState<any[]>([])
  let [initialColor, setInitialColor] = useState('#5e72e4')
  let [selectColor, setSelectColor] = useState<any>({})
  let [modalObj, setModalObj] = useState<any>({
    title: '',
    visible: false,
    loading: false,
    selectRow: {}
  })
  let [pageObj, setPageObj] = useState({
    pageSize: 10,
    total: 0,
    currentPage: 1
  })
  let [sortObj, setSortObj] = useState({
    sortBy: '',
    sortOrders: ''
  })

  let tableColumns = [
    {
      title: '链接名称',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'name'
    },
    {
      title: '链接地址',
      align: 'center' as 'center',
      ellipsis: true,
      dataIndex: 'linkAddress',
      render: (text:string, record:any) => (
        <span>
          {text || '--'}
        </span>
      )
    },
    {
      title: '链接颜色',
      align: 'center' as 'center',
      dataIndex: 'color',
      render: (text:string, record:any) => (
        <div style={{width: '120px', height: '20px', margin: '0 auto', backgroundColor: text}}>
        </div>
      )
    },
    {
      title: '创建时间',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      align: 'center' as 'center',
      dataIndex: 'operate',
      render: (text:string, record:any) => (
        <Space size='large'>
          {
            userInfo.roleId.functionList.includes('5e834faffb69305aa091e831')?
            <Button type='primary' onClick={()=>editLink(record)}>编辑</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e834fb5fb69305aa091e832')?
            <Button type="primary" onClick={()=>linkRemove(record._id)} danger>删除</Button>:''
          }
        </Space>
      )
    }
  ]

  useEffect(() => {
    getDataList()
  }, []);

  // 获取列表数据
  const getDataList = (page?: Boolean)=>{
    pageObj.currentPage = page === true?pageObj.currentPage:1;
    let formModel = searchForm.getFieldsValue();
    let sortOrders = '';
    if(sortObj.sortOrders){
      if(sortObj.sortOrders === 'ascend'){
        sortOrders = '1';
      }else{
        sortOrders = '0';
      }
    }
    api.link.linkList({
      currentPage: pageObj.currentPage,
      pageSize: pageObj.pageSize,
      name: formModel.name,
      sortBy: sortObj.sortBy,
      sortOrders
    }).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        pageObj.total = res.data.data.count;
        setPageObj({...pageObj})
        setTableData([...res.data.data.data])
      }else{
        message.warning('获取链接列表失败');
      }
    })
  }
  // table排序分页变化
  const tableChange = (pagination:any, filters:any, sorter:any) =>{
    if(pageObj.currentPage !== pagination.current || pageObj.pageSize !== pagination.pageSize){
      pageObj.currentPage = pagination.current;
      pageObj.pageSize = pagination.pageSize;
      setPageObj({...pageObj})
      getDataList(true)
    }
    if(JSON.stringify(sorter) !== '{}'){
      if(sorter.field !== sortObj.sortBy || sorter.order !== sortObj.sortOrders){
        sortObj.sortBy = sorter.order?sorter.field:'';
        sortObj.sortOrders = sorter.order?sorter.order:'';
        setSortObj({...sortObj})
        getDataList()
      }
    }
  }
  // 友情链接删除
  const linkRemove = (id:string)=>{
    confirm({
      title: '提示',
      content: '此操作将删除该友情链接, 是否继续?',
      closable: true,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          api.link.linkDel(id).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList();
              message.success('友情链接删除成功');
            }else{
              message.warning('友情链接删除失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 友情链接新增
  const linkAdd = ()=>{
    modalObj.title = '新增友情链接';
    modalObj.selectRow = {};
    modalObj.visible = true;
    setModalObj({...modalObj})
  }
  // 编辑打开弹框
  const editLink = (row:any)=>{
    modalObj.title = '编辑友情链接';
    modalObj.selectRow = row;
    modalObj.visible = true;
    modalForm.setFieldsValue({ 
      name: row.name,
      linkAddress: row.linkAddress
    })
    setInitialColor(row.color)
    setModalObj({...modalObj})
  }
  // 新增或编辑提交
  const modalConfir = ()=>{
    modalForm.validateFields().then((values)=>{
      modalObj.loading = true;
      setModalObj({...modalObj})
      if(modalObj.selectRow._id){
        api.link.linkUpdate({
          id: modalObj.selectRow._id,
          name: values.name,
          linkAddress: values.linkAddress,
          color: selectColor.hex || initialColor
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getDataList();
            message.success('友情链接信息更新成功');
          }else if(code === constantData.dataAlready){
            message.warning('友情链接名称已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else{
            message.warning('友情链接信息更新失败');
          }
          setModalObj({...modalObj})
        })
      }else{
        api.link.linkAdd({
          name: values.name,
          linkAddress: values.linkAddress,
          color: selectColor.hex || initialColor
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getDataList();
            modalForm.resetFields();
            message.success('友情链接信息添加成功');
          }else if(code === constantData.dataAlready){
            message.warning('友情链接名称已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else{
            message.warning('友情链接信息添加失败');
          }
          setModalObj({...modalObj})
        })
      }
    }).catch(()=>{});
  }
  // 关闭弹框
  const modalCancel = ()=>{
    modalObj.visible = false;
    setInitialColor('#5e72e4')
    modalForm.resetFields();
    setModalObj({...modalObj})
  }

  return <div className='link-wrapper'>
    <h2 className='content-title'>友情链接管理</h2>
    <div className="box-table">
      <Form
        layout='inline'
        form={searchForm}
      >
        <Form.Item label="链接名称" name='name' className='margin-bottom-20'>
           <Input 
            maxLength={20} 
            allowClear={true}
            onBlur={()=>{getDataList()}} 
            placeholder="链接名称" 
          />
        </Form.Item>
        <Form.Item className='margin-left-30 margin-bottom-20'>
           {
             userInfo.roleId.functionList.includes('5e834f9efb69305aa091e830')?<Button type="primary" onClick={linkAdd}>新增</Button>:''
           }
        </Form.Item>
      </Form>
      <div className="table-show">
        <Table rowKey='_id' columns={tableColumns} dataSource={tableData} pagination={{
          total: pageObj.total,
          showTotal: ()=>`共 ${pageObj.total} 条`,
          current: pageObj.currentPage,
          pageSize: pageObj.pageSize,
        }} onChange={tableChange} />
      </div>
    </div>
    <Modal className='modal-height' title={modalObj.title}  maskClosable={false} confirmLoading={modalObj.loading} visible={modalObj.visible} onOk={modalConfir} onCancel={modalCancel}>
    <Form
        form={modalForm}
        validateTrigger='onBlur'
        requiredMark={false}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="链接名称"
          rules={FormValidate({name: '链接名称'})}
        >
          <Input 
            maxLength={20} 
            allowClear={true} 
            placeholder="链接名称" 
          />
        </Form.Item>
        <Form.Item
          name="linkAddress"
          label="链接地址"
          rules={FormValidate({name: '链接地址'})}
        >
          <Input  
            allowClear={true} 
            placeholder="链接地址" 
          />
        </Form.Item>
        <Form.Item
          name="color"
          label="链接颜色"
        >
          <InputColor initialValue={initialColor} onChange={setSelectColor} />
        </Form.Item>
      </Form>
    </Modal>
  </div>;
};

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

export default connect(mapStateToProps)(Link)
