// Linked List
#include<stdlib.h>
#include<stdio.h>

// define the data structure
struct Node {
    int data;
    struct Node* next;
};

// functions
struct Node* CreateNode(int x) {
    struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
    // temp->data is syntactic sugar of (*temp).data
    temp->data = x;
    temp->next = NULL;
}
struct Node* Append(struct Node* head, int x) {
    // insert node at the end
    struct Node* temp = CreateNode(x);
    if (head == NULL) head = temp;
    else {
        struct Node* current = head;
        while (current->next != NULL) current = current->next;
        current->next = temp;
    }
    return head;
}
struct Node* Prepend(struct Node* head, int x) {
    // insert node at beginning
    struct Node* temp = CreateNode(x);
    if (head != NULL) temp->next = head;
    head = temp;
    return head;
}
struct Node* Insert(struct Node* head, int index, int x) {
    // insert node at index (zero indexing)
    // edge cases (e.g. index - 1 is larger than current size of list) is not handled
    struct Node* temp = CreateNode(x);
    // method 1
    if (index == 0) {
        temp->next = head;
        head = temp;
    } else {
        struct Node* prev = head;
        for (int i = 0;i < index - 1;i++) prev = prev->next;
        temp->next = prev->next;
        prev->next = temp;
    }

    // method 2
    // struct Node* current = head;
    // struct Node* prev = NULL;
    // for(int i = 0;i < index;i++) {
    //     prev = current;
    //     current = current->next;
    // }
    // if (prev == NULL) head = temp;
    // else prev->next = temp;
    // temp->next=current;

    return head;
}
struct Node* Delete(struct Node* head, int index) {
    // delete node at index
    // edge cases (e.g. index - 1 is larger than current size of list) is not handled
    struct Node* prev = NULL;
    struct Node* current = head;
    for(int i = 0;i < index;i++) {
        prev = current;
        current = current->next;
    }
    if (prev == NULL) head = current->next;
    else prev->next = current->next;
    free(current);

    return head;
}
struct Node* IterativeReverse(struct Node* head) {
    // reverse the list iteratively
    // struct Node* prev = NULL;
    // struct Node* current = head;
    // struct Node* next = head;
    struct Node *prev,*current,*next;
    prev = NULL;
    current = head;
    while(current != NULL){
        next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    head = prev;
    return head;
}
struct Node* RecursiveReverse(struct Node* head, struct Node* node) {
    // reverse the list recursively
    if (node->next != NULL) {
        head = RecursiveReverse(head, node->next);
        // struct Node* next = node->next;
        // next->next = node;
        node->next->next = node;
        node->next = NULL;
    } else {
        head = node;
    }

    return head;
}
void IterativePrint(struct Node* head) {
    // print the list iteratively
    struct Node* temp = head;
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }  
    printf("\n");  
}
void RecursivePrint(struct Node* node) {
    // print the list recursively
    // exit condition
    if (node != NULL) {
        printf("%d ", node->data);
        RecursivePrint(node->next);
    } else {
        printf("\n");
    }
}
void ReversePrint(struct Node* node) {
    // reverse print the list recursively
    if (node != NULL) {
        ReversePrint(node->next);
        printf("%d ", node->data);
    }
    // Q: how to print the new line charater in the end
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
    // head = Append(head, 1);
    // head = Append(head, 2);
    // head = Append(head, 3);
    // head = Append(head, 4);

    // insert test
    head = Prepend(head, 4);
    head = Prepend(head, 3);
    head = Insert(head, 0, 1);
    head = Insert(head, 1, 2);

    // delete test
    // head = Delete(head, 0);
    // head = Delete(head, 0);

    // reverse tests
    // head = IterativeReverse(head);
    head = RecursiveReverse(head, head);

    // IterativePrint(head);
    RecursivePrint(head);
    // ReversePrint(head);
}