import React,{useEffect,useState} from 'react';
import { Input,Row,Col,Button,Form,Card,Layout,Divider } from 'antd';
const { Header } = Layout;
import axios from 'axios';


export default function Home() {
const [inputVal,setInputVal]=useState('') 
const [age,setAge]=useState(null)
const[gender,setGender]=useState(null)
const[nation,setNation]=useState(null)
const [loading,setLoading]=useState(false)
const[inputError,setinputError]=useState({})
let errors={}

const handleInput=(e)=>setInputVal(e.target.value)

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 55,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: 'grey',
};

const getCountry=(arr)=>{
 let prob=0
 let val={}
  for(let i=0; i<arr.length; i++){
    if(arr[i].probability>prob){
      prob = arr[i].probability
      val = arr[i]
  }
}
setNation(val)
}
const validation=()=>{
  if(inputVal.trim().length===0){
    errors.message="Please Enter Name"
  }
}

const handleSubmit=()=>{
  validation()
  if(Object.keys(errors).length==0){
    setLoading(true)
    axios.get(`https://api.agify.io/?name=${inputVal}`)
    .then((res)=>{
      const result=res.data
      setAge(result)
      return axios.get(`https://api.genderize.io/?name=${inputVal}`)
    })
    .then((res)=>{
      setGender(res.data)
      return axios.get(`https://api.nationalize.io/?name=${inputVal}`)
    })
    .then((res)=>{
      getCountry(res.data['country'])
      setLoading(false)
    })
    .catch((err)=>{
      alert(err.message)
      setLoading(false)
    })
    setinputError({})
  }else{
    setinputError(errors)
  }
}
  return (
    <>
    <Header style={headerStyle}>Hy-Vee</Header>
      <main style={{marginTop:'10px'}}>
        <Form onFinish={handleSubmit}>
      <Row>
      <Col span={12} offset={6}>
        <Input placeholder='Please Enter Name' onChange={handleInput} />
        <span style={{fontSize:'20px',color:'red',padding:'10px',margin:'10px',display:'flex',justifyContent:'center',alignItems:'center'}}>{inputError.message&&inputError.message} </span>
      </Col>
    </Row>
    <Row>
      <Col span={13} offset={11} style={{marginTop:'20px'}}>
       <Button htmlType="submit"type='primary' loading={loading} >{loading?"Loading Please Wait":'Get Data'} </Button>
      </Col>
    </Row>
    </Form>
    <Row>
    <Col span={12} offset={8}>
      {
        age && gender && nation &&<>
         <Card  style={{
      width: 300,
      margin:10
    }}>
      <h4>Name:{age.name}</h4>
      <h4>age:{age.age} </h4>
      <h4>Gender:{gender.gender}</h4>
      <h4>country:{nation.country_id}</h4>
    </Card>
        </>
      }
    </Col>
    </Row>
      </main>
    </>
  )
}
