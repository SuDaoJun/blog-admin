import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, DatePicker, Space, Table, Modal } from 'antd';
import { connect } from 'react-redux'
import { StoreState } from '@/store/types'
import api from '@/api/index';
import { constantData, currentSelectTime } from '@/utils/utils';
import { FormValidate } from '@/utils/format';
import InputColor from 'react-input-color';

const ArticleListTag = (props: any) => {
  const { confirm } = Modal;
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const { RangePicker } = DatePicker;
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
      title: '标签名称',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'name'
    },
    {
      title: '标签描述',
      align: 'center' as 'center',
      ellipsis: true,
      dataIndex: 'description',
      render: (text:string, record:any) => (
        <span>
          {text || '--'}
        </span>
      )
    },
    {
      title: '标签背景色',
      align: 'center' as 'center',
      dataIndex: 'bgColor',
      render: (text:string, record:any) => (
        <div style={{width: '120px', height: '20px', margin: '0 auto', backgroundColor: text}}>
        </div>
      )
    },
    {
      title: '创建用户',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'createUser',
      render: (text:string, record:any) => (
        <span>
          {record.createUser?record.createUser.name:'--'}
        </span>
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
            userInfo.roleId.functionList.includes('5e834f5afb69305aa091e828')?
            <Button type='primary' onClick={()=>editTag(record)}>编辑</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e834f61fb69305aa091e829')?
            <Button type="primary" onClick={()=>tagRemove(record._id)} danger>删除</Button>:''
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
    api.article.tagList({
      currentPage: pageObj.currentPage,
      pageSize: pageObj.pageSize,
      name: formModel.name,
      createTime: formModel.createTime?currentSelectTime(formModel.createTime[0])+','+currentSelectTime(formModel.createTime[1]):null,
      sortBy: sortObj.sortBy,
      sortOrders
    }).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        pageObj.total = res.data.data.count;
        setPageObj({...pageObj})
        setTableData([...res.data.data.data])
      }else{
        message.warning('获取标签列表失败');
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
  // 标签删除
  const tagRemove = (id:string)=>{
    confirm({
      title: '提示',
      content: '此操作将删除该标签, 是否继续?',
      closable: true,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          api.article.tagDel(id).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList();
              message.success('标签删除成功');
            }else{
              message.warning('标签删除失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 标签新增
  const tagAdd = ()=>{
    modalObj.title = '新增标签';
    modalObj.selectRow = {};
    modalObj.visible = true;
    setModalObj({...modalObj})
  }
  // 编辑打开弹框
  const editTag = (row:any)=>{
    modalObj.title = '编辑标签';
    modalObj.selectRow = row;
    modalObj.visible = true;
    modalForm.setFieldsValue({ 
      name: row.name,
      description: row.description
    })
    setInitialColor(row.bgColor)
    setModalObj({...modalObj})
  }
  // 新增或编辑提交
  const modalConfir = ()=>{
    modalForm.validateFields().then((values)=>{
      modalObj.loading = true;
      setModalObj({...modalObj})
      if(modalObj.selectRow._id){
        api.article.tagUpdate({
          id: modalObj.selectRow._id,
          name: values.name,
          description: values.description,
          bgColor: selectColor.hex || initialColor
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getDataList();
            message.success('标签信息更新成功');
          }else if(code === constantData.dataAlready){
            message.warning('标签名称已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else{
            message.warning('标签信息更新失败');
          }
          setModalObj({...modalObj})
        })
      }else{
        api.article.tagAdd({
          name: values.name,
          description: values.description,
          bgColor: selectColor.hex || initialColor
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getDataList();
            modalForm.resetFields();
            message.success('标签信息添加成功');
          }else if(code === constantData.dataAlready){
            message.warning('标签名称已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else{
            message.warning('标签信息添加失败');
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

  return <div className='tag-wrapper'>
    <h2 className='content-title'>文章标签</h2>
    <div className="box-table">
      <Form
        layout='inline'
        form={searchForm}
      >
        <Form.Item label="标签名称" name='name' className='margin-bottom-20'>
           <Input 
            maxLength={20} 
            allowClear={true}
            onBlur={()=>{getDataList()}} 
            placeholder="标签名称" 
          />
        </Form.Item>
        <Form.Item label="创建时间" name='createTime' className='margin-bottom-20'>
           <RangePicker onChange={()=>{getDataList()}} />
        </Form.Item>
        <Form.Item className='margin-left-30 margin-bottom-20'>
           {
             userInfo.roleId.functionList.includes('5e834f51fb69305aa091e827')?<Button type="primary" onClick={tagAdd}>新增</Button>:''
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
    <Modal className='modal-height' title={modalObj.title} maskClosable={false} confirmLoading={modalObj.loading} visible={modalObj.visible} onOk={modalConfir} onCancel={modalCancel}>
    <Form
        form={modalForm}
        validateTrigger='onBlur'
        requiredMark={false}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="标签名称"
          rules={FormValidate({name: '标签名称'})}
        >
          <Input 
            maxLength={20} 
            allowClear={true} 
            placeholder="标签名称" 
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="标签描述"
        >
          <Input 
            maxLength={40} 
            allowClear={true} 
            placeholder="标签描述" 
          />
        </Form.Item>
        <Form.Item
          name="color"
          label="标签颜色"
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

export default connect(mapStateToProps)(ArticleListTag)
