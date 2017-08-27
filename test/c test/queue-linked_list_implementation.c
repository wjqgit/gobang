// Queue - Linked list based implementation
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

// define data structures
struct Node
{
    int data;
    struct Node *link;
};

struct Queue
{
    struct Node *front;
    struct Node *rear;
};

// functions
struct Node *CreateNode(int x)
{
    struct Node *temp = (struct Node *)malloc(sizeof(struct Node));
    temp->data = x;
    temp->link = NULL;
    return temp;
}

struct Queue *CreateQueue()
{
    struct Queue *q = (struct Queue *)malloc(sizeof(struct Queue));
    q->front = NULL;
    q->rear = NULL;
    return q;
}

bool IsEmpty(struct Queue *q)
{
    return q->front == NULL && q->rear == NULL;
}

void Enqueue(struct Queue *q, int x)
{
    struct Node *temp = CreateNode(x);

    if (IsEmpty(q))
    {
        q->front = temp;
    }
    else
    {
        q->rear->link = temp;
    }
    q->rear = temp;
}

void Dequeue(struct Queue *q)
{
    struct Node* temp = q->front;
    if (IsEmpty(q)) return;
    else {
    } if (q->front == q->rear) {
        q->front = NULL;
        q->rear = NULL;
    } else {
        q->front = q->front->link;
    }

    free(temp);
        
}

int Front(struct Queue *q)
{
    if(IsEmpty(q)) return -1;
    else return q->front->data;
}

void PrintLinkedList(struct Node *n)
{
    if (n != NULL)
    {
        printf("%d ", n->data);
        PrintLinkedList(n->link);
    }
    else
    {
        printf("\n");
    }
}

void Print(struct Queue *q)
{
    printf("===Queue===\n");
    if (q->front == NULL) printf("The queue is empty.\n");
    else PrintLinkedList(q->front);
    printf("===========\n");
}

int main()
{
    struct Queue *q = CreateQueue();

    // Enqueue test
    Enqueue(q, 1);
    Enqueue(q, 2);
    Enqueue(q, 3);
    Enqueue(q, 4);

    // Dequeue test
    printf("Front is %d.\n", Front(q));
    Dequeue(q);
    printf("Front is %d.\n", Front(q));
    Dequeue(q);
    printf("Front is %d.\n", Front(q));
    Dequeue(q);
    printf("Front is %d.\n", Front(q));
    Dequeue(q);
    printf("Front is %d.\n", Front(q));


    Print(q);
}
