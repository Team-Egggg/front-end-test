class TestClass{
    static test1(){
        return 1
    }
    static test2(){
        return 2
    }
    static test3(){
        return 3
    }
}



function add(a,b){
    if(a === 0 || b === 0) return 0;
    return a+b;
}

describe('TestClass 메서드 테스트',()=>{
    test('test1 메서드는 1을 반환한다.',()=>{
        expect(TestClass.test1()).toBe(1);
    })

    test('test2 메서드는 2을 반환한다.',()=>{
        expect(TestClass.test2()).toBe(2);
    })
    test('test3 메서드는 3을 반환한다.',()=>{
        expect(TestClass.test3()).toBe(3);
    })
})

describe('add 함수 테스트',()=>{
    test('인자중 하나가 0일 경우 0을 반환한다.',()=>{
        expect(add(3,0)).toBe(0)
        expect(add(0,50)).toBe(0)
    })

    test('0이 아닌 두 수가 들어갈 경우 두수의 합을 반환한다.',()=>{
        expect(add(1,5)).toBe(6);
        expect(add(50,2)).toBe(52);
    })
})

const state1 = {
    test : false,
}
const state2 = {
    test : false,
}

describe('state1 테스트',()=>{
    beforeAll(()=>{
        state1.test = true;
    })
    test('test의 값은 true 여야한다.',()=>{
        expect(state1.test).toBeTruthy();
    })
})

describe('state2 테스트',()=>{
    beforeAll(()=>{
        state2.test = true;
    })
    test('test의 값은 true 여야한다.',()=>{
        expect(state2.test).toBeTruthy();
    })
})

const promise = new Promise(resolve=>{
    setTimeout(()=>{
        resolve(3)
    },5000);
})

test('오래 걸리는 테스트',async ()=>{
    const result = await promise;
    expect(result).toBe(3);
})

test('문제가 되는 테스트',()=>{
    expect(true).toBe(true);
})
