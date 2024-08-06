import React from 'react';

const ContainerPage = (props) => {
  return (
    <>
    <section className={props.class1}>
        <div className="container-xxl">{props.children}</div>
    </section>
    </>
  )
}

export default ContainerPage;