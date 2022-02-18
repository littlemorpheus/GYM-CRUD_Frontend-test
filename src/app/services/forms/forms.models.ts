export interface JSONFormValidators {
    min?: number;
    max?: number;
    required?: boolean;
    minLength?: number;
    maxLength?:number
}

export interface JSONFormControls {
    name: string;//name
    label: string;//placeholder or label
    value: string;//dafualt value
    type: string;//Select, Input or Image
    nested?: JSONFormData;
    validators: JSONFormValidators;
}

interface JSONFormControlOptions {
    min?: number;
    max?: number;
    step?: number;
} 

export interface JSONFormData {
    controls: JSONFormControls[];
}