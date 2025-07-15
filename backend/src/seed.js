const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 관리자 계정 정보
  const adminEmail = 'admin@aiedu.com';
  const adminPassword = 'admin123';
  const adminName = 'Admin User';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // 관리자 계정 생성 또는 upsert
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      language: 'KOREAN',
      level: 'ADVANCED',
    },
  });

  // 테스트 계정도 동일하게 보장
  const testUser = await prisma.user.upsert({
    where: { email: 'test@aiedu.com' },
    update: {},
    create: {
      email: 'test@aiedu.com',
      password: hashedPassword,
      name: 'Test User',
      language: 'ENGLISH',
      level: 'BEGINNER',
    },
  });

  console.log('✅ Users created or ensured');
  console.log('관리자 계정:');
  console.log(`  이메일: ${adminEmail}`);
  console.log(`  비밀번호: ${adminPassword}`);
  console.log('테스트 계정:');
  console.log('  이메일: test@aiedu.com');
  console.log('  비밀번호: admin123');

  // Create sample contents
  const contents = [
    {
      title: '인공지능의 기본 개념',
      description: 'AI의 기본 개념과 역사에 대해 알아봅니다.',
      category: 'AI_BASICS',
      difficulty: 'BEGINNER',
      isPublished: true,
      publishedAt: new Date(),
      translations: {
        create: [
          {
            language: 'KOREAN',
            title: '인공지능의 기본 개념',
            content: `인공지능(AI)은 인간의 학습능력과 추론능력, 지각능력, 자연언어의 이해능력 등을 컴퓨터 프로그램으로 실현한 기술입니다.

AI의 주요 특징:
1. 학습 능력: 데이터로부터 패턴을 학습
2. 추론 능력: 새로운 상황에 대한 판단
3. 문제 해결: 복잡한 문제를 단계별로 해결

AI의 역사:
- 1950년대: AI 개념의 탄생
- 1960-70년대: 전문가 시스템 개발
- 1980-90년대: 머신러닝의 발전
- 2000년대 이후: 딥러닝의 혁신

현재 AI는 우리 생활의 다양한 분야에서 활용되고 있으며, 앞으로도 더욱 발전할 것으로 예상됩니다.`,
            summary: 'AI의 기본 개념, 특징, 역사를 학습합니다.'
          },
          {
            language: 'ENGLISH',
            title: 'Basic Concepts of Artificial Intelligence',
            content: `Artificial Intelligence (AI) is a technology that realizes human learning ability, reasoning ability, perception ability, and natural language understanding ability through computer programs.

Key features of AI:
1. Learning ability: Learning patterns from data
2. Reasoning ability: Making judgments in new situations
3. Problem solving: Solving complex problems step by step

History of AI:
- 1950s: Birth of AI concept
- 1960-70s: Development of expert systems
- 1980-90s: Advancement of machine learning
- 2000s onwards: Innovation in deep learning

Currently, AI is being used in various fields of our daily lives and is expected to develop further in the future.`,
            summary: 'Learn the basic concepts, features, and history of AI.'
          },
          {
            language: 'JAPANESE',
            title: '人工知能の基本概念',
            content: `人工知能（AI）は、人間の学習能力、推論能力、知覚能力、自然言語理解能力などをコンピュータプログラムで実現した技術です。

AIの主な特徴：
1. 学習能力：データからパターンを学習
2. 推論能力：新しい状況での判断
3. 問題解決：複雑な問題を段階的に解決

AIの歴史：
- 1950年代：AI概念の誕生
- 1960-70年代：エキスパートシステムの開発
- 1980-90年代：機械学習の発展
- 2000年代以降：ディープラーニングの革新

現在、AIは私たちの生活の様々な分野で活用されており、今後もさらに発展することが期待されています。`,
            summary: 'AIの基本概念、特徴、歴史を学習します。'
          },
          {
            language: 'CHINESE',
            title: '人工智能的基本概念',
            content: `人工智能（AI）是通过计算机程序实现人类学习能力、推理能力、感知能力和自然语言理解能力的技术。

AI的主要特征：
1. 学习能力：从数据中学习模式
2. 推理能力：在新情况下的判断
3. 问题解决：逐步解决复杂问题

AI的历史：
- 1950年代：AI概念的诞生
- 1960-70年代：专家系统的发展
- 1980-90年代：机器学习的进步
- 2000年代以后：深度学习的创新

目前，AI正在我们生活的各个领域得到应用，预计未来还将进一步发展。`,
            summary: '学习AI的基本概念、特征和历史。'
          }
        ]
      }
    },
    {
      title: '머신러닝 입문',
      description: '머신러닝의 기본 원리와 알고리즘을 학습합니다.',
      category: 'MACHINE_LEARNING',
      difficulty: 'INTERMEDIATE',
      isPublished: true,
      publishedAt: new Date(),
      translations: {
        create: [
          {
            language: 'KOREAN',
            title: '머신러닝 입문',
            content: `머신러닝은 컴퓨터가 데이터로부터 학습하여 패턴을 발견하고 예측을 수행하는 기술입니다.

머신러닝의 주요 유형:
1. 지도학습 (Supervised Learning)
   - 분류 (Classification): 이메일 스팸 필터링
   - 회귀 (Regression): 집값 예측

2. 비지도학습 (Unsupervised Learning)
   - 클러스터링: 고객 그룹화
   - 차원 축소: 데이터 시각화

3. 강화학습 (Reinforcement Learning)
   - 게임 AI, 자율주행차

주요 알고리즘:
- 선형 회귀 (Linear Regression)
- 로지스틱 회귀 (Logistic Regression)
- 결정 트리 (Decision Tree)
- 랜덤 포레스트 (Random Forest)
- 서포트 벡터 머신 (SVM)
- K-평균 클러스터링 (K-means)

머신러닝 프로세스:
1. 데이터 수집
2. 데이터 전처리
3. 모델 선택
4. 모델 학습
5. 모델 평가
6. 모델 배포`,
            summary: '머신러닝의 기본 원리와 주요 알고리즘을 학습합니다.'
          },
          {
            language: 'ENGLISH',
            title: 'Introduction to Machine Learning',
            content: `Machine Learning is a technology where computers learn from data to discover patterns and make predictions.

Main types of Machine Learning:
1. Supervised Learning
   - Classification: Email spam filtering
   - Regression: House price prediction

2. Unsupervised Learning
   - Clustering: Customer grouping
   - Dimensionality Reduction: Data visualization

3. Reinforcement Learning
   - Game AI, Autonomous vehicles

Key Algorithms:
- Linear Regression
- Logistic Regression
- Decision Tree
- Random Forest
- Support Vector Machine (SVM)
- K-means Clustering

Machine Learning Process:
1. Data Collection
2. Data Preprocessing
3. Model Selection
4. Model Training
5. Model Evaluation
6. Model Deployment`,
            summary: 'Learn the basic principles and key algorithms of machine learning.'
          }
        ]
      }
    },
    {
      title: '딥러닝 기초',
      description: '딥러닝의 기본 개념과 신경망을 학습합니다.',
      category: 'DEEP_LEARNING',
      difficulty: 'ADVANCED',
      isPublished: true,
      publishedAt: new Date(),
      translations: {
        create: [
          {
            language: 'KOREAN',
            title: '딥러닝 기초',
            content: `딥러닝은 인공신경망을 기반으로 한 머신러닝의 한 분야입니다.

신경망의 구조:
1. 입력층 (Input Layer): 데이터 입력
2. 은닉층 (Hidden Layer): 특징 추출
3. 출력층 (Output Layer): 결과 출력

주요 딥러닝 모델:
1. CNN (Convolutional Neural Network)
   - 이미지 인식, 컴퓨터 비전
   - 컨볼루션층, 풀링층, 완전연결층

2. RNN (Recurrent Neural Network)
   - 시계열 데이터, 자연어 처리
   - LSTM, GRU

3. Transformer
   - 자연어 처리의 혁신
   - Attention 메커니즘

딥러닝 프레임워크:
- TensorFlow
- PyTorch
- Keras

활용 분야:
- 이미지 인식
- 음성 인식
- 자연어 처리
- 자율주행
- 의료 진단`,
            summary: '딥러닝의 기본 개념과 신경망 구조를 학습합니다.'
          },
          {
            language: 'ENGLISH',
            title: 'Deep Learning Basics',
            content: `Deep Learning is a branch of machine learning based on artificial neural networks.

Neural Network Structure:
1. Input Layer: Data input
2. Hidden Layer: Feature extraction
3. Output Layer: Result output

Key Deep Learning Models:
1. CNN (Convolutional Neural Network)
   - Image recognition, Computer vision
   - Convolutional layer, Pooling layer, Fully connected layer

2. RNN (Recurrent Neural Network)
   - Time series data, Natural language processing
   - LSTM, GRU

3. Transformer
   - Innovation in natural language processing
   - Attention mechanism

Deep Learning Frameworks:
- TensorFlow
- PyTorch
- Keras

Application Areas:
- Image recognition
- Speech recognition
- Natural language processing
- Autonomous driving
- Medical diagnosis`,
            summary: 'Learn the basic concepts and neural network structure of deep learning.'
          }
        ]
      }
    }
  ];

  for (const content of contents) {
    await prisma.content.create({
      data: content
    });
  }

  console.log('✅ Contents created');

  // Create sample questions
  const questions = [
    {
      userId: testUser.id,
      title: 'AI와 머신러닝의 차이점이 궁금합니다',
      content: 'AI와 머신러닝이 어떻게 다른지, 그리고 어떤 관계인지 설명해주세요.',
      language: 'KOREAN'
    },
    {
      userId: testUser.id,
      title: '딥러닝 모델 학습 시 과적합을 방지하는 방법',
      content: '딥러닝 모델을 학습할 때 과적합을 방지하는 효과적인 방법들을 알려주세요.',
      language: 'KOREAN'
    }
  ];

  for (const question of questions) {
    await prisma.question.create({
      data: question
    });
  }

  console.log('✅ Questions created');

  // Create sample study groups
  const studyGroups = [
    {
      name: 'AI 입문자 모임',
      description: 'AI를 처음 배우는 분들을 위한 스터디 그룹입니다.',
      language: 'KOREAN',
      maxMembers: 15,
      isPrivate: false,
      members: {
        create: {
          userId: adminUser.id,
          role: 'ADMIN'
        }
      }
    },
    {
      name: 'Machine Learning Study Group',
      description: 'A study group for those learning machine learning.',
      language: 'ENGLISH',
      maxMembers: 20,
      isPrivate: false,
      members: {
        create: {
          userId: adminUser.id,
          role: 'ADMIN'
        }
      }
    }
  ];

  for (const studyGroup of studyGroups) {
    await prisma.studyGroup.create({
      data: studyGroup
    });
  }

  console.log('✅ Study groups created');

  // Create sample notifications
  const notifications = [
    {
      userId: testUser.id,
      title: '새로운 콘텐츠가 추가되었습니다',
      message: '오늘의 AI 학습 콘텐츠가 준비되었습니다. 확인해보세요!',
      type: 'NEW_CONTENT'
    },
    {
      userId: testUser.id,
      title: '학습 리마인더',
      message: '오늘도 AI 학습을 잊지 마세요!',
      type: 'DAILY_REMINDER'
    }
  ];

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification
    });
  }

  console.log('✅ Notifications created');

  console.log('🎉 Database seeding completed!');
  console.log('📧 Admin email: admin@aiedu.com');
  console.log('📧 Test email: test@aiedu.com');
  console.log('🔑 Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 