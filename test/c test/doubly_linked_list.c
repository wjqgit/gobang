// Doubly Linked List
#include<stdlib.h>
#include<stdio.h>

// define the data structure
struct Node {
    int data;
    struct Node* prev;
    struct Node* next;
};

// functions
struct Node* CreateNode(int x) {
    struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
    temp->data = x;
    temp->prev = NULL;
    temp->next = NULL;
}
struct Node* Prepend(struct Node* head, int x) {
    struct Node* temp = CreateNode(x);
    if (head == NULL) {
        head = temp;
    } else  {
        head->prev = temp;
        temp->next = head;
        head = temp;
    }

    return head;
}
struct Node* Append(struct Node* head, int x) {
    struct Node* temp = CreateNode(x);
    if(head == NULL) head = temp;
    else {
        struct Node* last = head;
        while(last->next != NULL) last = last->next;
        last->next = temp;
        temp->prev = last;     
    }

    return head;
}
void Print(struct Node* head) {
    while(head != NULL) {
        printf("%d ", head->data);
        head = head->next;
    }
    printf("\n");
}
void ReversePrint(struct Node* node) {
    if (node != NULL) {
        ReversePrint(node->next);
        printf("%d ", node->data);
    }
}

// main function
int main() {
    struct Node* head = NULL;
    // prepend test
    // head = Prepend(head, 4);
    // head = Prepend(head, 3);
    // head = Prepend(head, 2);
    // head = Prepend(head, 1);

    // append test
    head = Append(head, 1);
    head = Append(head, 2);
    head = Append(head, 3);
    head = Append(head, 4);

    Print(head);
    ReversePrint(head);
}