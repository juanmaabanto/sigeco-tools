import React from 'react';

const Page = props => {

    return (
      <div style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', overflowY: 'auto', ...props.style }}>
        {props.children}
      </div>
    );
}

Page.propTypes = { }

export default Page;