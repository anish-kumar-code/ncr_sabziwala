// import { Input, Modal } from 'antd'
// import React, { useState } from 'react'
// import OrderTable from './components/OrderTable'

// function Order() {
//     const [searchText, setSearchText] = useState('');

//     return (
//         <>
//             <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between '>
//                 <Input.Search
//                     placeholder="Search by name"
//                     onChange={(e) => setSearchText(e.target.value)}
//                     style={{
//                         maxWidth: 300,
//                         borderRadius: '6px'
//                     }}
//                     size="large"
//                 />
//             </div>
//             <OrderTable searchText={searchText} />
//         </>
//     )
// }

// export default Order


import { Input, Tabs } from 'antd';
import React, { useState } from 'react';
import OrderTable from './components/OrderTable';

const { TabPane } = Tabs;

function Order() {
    const [searchText, setSearchText] = useState('');
    const [orderType, setOrderType] = useState('ready'); // default tab

    return (
        <>
            <div className='lg:px-10 px-5 my-8'>
                <div className='md:flex items-center gap-4 justify-between'>
                    <Input.Search
                        placeholder="Search by name"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{
                            maxWidth: 300,
                            borderRadius: '6px'
                        }}
                        size="large"
                    />
                </div>

                <Tabs
                    defaultActiveKey="running"
                    onChange={(key) => setOrderType(key)}
                    className="mt-6"
                >
                    <TabPane tab="Ready Orders" key="ready" />
                    <TabPane tab="Assigned Orders" key="shipped" />
                    <TabPane tab="Running Orders" key="running" />
                    <TabPane tab="All Orders" key="all" />
                </Tabs>
            </div>

            <OrderTable searchText={searchText} type={orderType} />
        </>
    );
}

export default Order;
