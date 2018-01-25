// Stack - Array based implementation
#include<stdio.h>
#include<stdlib.h>
#include<stdbool.h>
#define MAX_SIZE 101

// define the data structure
struct Stack {
    int data[MAX_SIZE];
    int top;
};

// functions
struct Stack* CreateStack() {
    struct Stack* s = (struct Stack*)malloc(sizeof(struct Stack));
    s->top = -1;

    return s;
}

void Push(struct Stack* s, int x) {
    s->top++;
    s->data[s->top] = x;
}

int Pop(struct Stack* s) {
    s->top--;
    return s->data[s->top + 1];
}

int Top(struct Stack* s) {
    return s->data[s->top];    
}

bool IsEmpty(struct Stack* s) {
    return s->top < 0;    
}

void Print(struct Stack* s) {
    for(int i = s->top;i >= 0;i--) {
        printf("%d\n", s->data[i]);
    }
}

int main() {
    struct Stack* s = CreateStack();

    // push test
    Push(s, 1);
    Push(s, 2);
    Push(s, 3);
    Push(s, 4);

    // pop test
    // printf("%d\n", Pop(s));
    // printf("%d\n", s->top);
    // printf("%d\n", Pop(s));
    // printf("%d\n", s->top);
    // printf("---\n");

    // top test
    // printf("%d\n", Top(s));

    // isEmpty test
    printf("%s\n", IsEmpty(s) ? "true" : "false");

    
    Print(s);

}