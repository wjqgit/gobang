// Stack - Linked list based implementation
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
// define data structure
struct Node {
    int data;
    struct Node* link;
};

struct Stack {
    struct Node* top;
};

// utils
struct Node* CreateNode(int x) {
    struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
    temp->data = x;
    temp->link = NULL;
}

struct Stack* CreateStack() {
    struct Stack* s = (struct Stack*)malloc(sizeof(struct Stack));
    s->top = NULL;

    return s;
}

// functions
void Push(struct Stack* s, int x) {
    struct Node* temp = CreateNode(x);
    temp->link = s->top;
    s->top = temp;
}

int Top(struct Stack* s) {
    if (s->top == NULL) return;
    // debug
    printf("%d\n", s->top->data);

    return s->top->data;
}

int Pop(struct Stack* s) {
    if (s->top == NULL) return;
    struct Node* temp = s->top;
    s->top = temp->link;
    free(temp);
}

bool IsEmpty(struct Stack* s) {
    return s->top == NULL;
}

int main() {
    struct Stack* s = CreateStack();

    // push test
    Push(s, 1);
    // Top(s);
    Push(s, 2);
    // Top(s);
    Push(s, 3);
    // Top(s);
    Push(s, 4);
    //Top(s);

    // pop test
    Pop(s);
    Top(s);
    Pop(s);
    Top(s);
    
    // isEmpty test
    Pop(s);
    Pop(s);
    printf("%s\n", IsEmpty(s) ? "true" : "false");

}