import { IllustrationNotFound, IllustrationNotFoundDark } from '@douyinfe/semi-illustrations';
import { Button, Empty } from '@douyinfe/semi-ui';
import type { NextPage } from 'next';
import Link from 'next/link';

const Page: NextPage = () => {
  return (
    <Empty
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
      image={<IllustrationNotFound className="w-[200px] h-[200px]" />}
      darkModeImage={<IllustrationNotFoundDark className="w-[200px] h-[200px]" />}
      description={'找不到您的文档哦~'}
    >
      <Link href={'/'}>
        <Button>回到首页</Button>
      </Link>
    </Empty>
  );
};

export default Page;
