export interface IBaseEntity<T> {
    id: T; 
    createdBy?: number; 
    created_at?: Date;  
    updatedBy?: number;  
    updated_at?: Date;   
    isDeleted: boolean;  
}
